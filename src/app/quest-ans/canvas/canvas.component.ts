import { Component, Input } from "@angular/core";
import {
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { fromEvent } from "rxjs";
import { concatMap, takeUntil, tap } from "rxjs/operators";

export enum Direction {
  up,
  left,
  down,
  right,
}

export const DistanceConfig = {
  up: {
    x: 0,
    y: 10,
  },
  left: {
    x: -10,
    y: 0,
  },
  down: {
    x: 0,
    y: -10,
  },
  right: {
    x: 10,
    y: 0,
  },
};

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.css"],
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @Input()
  viewCanvas!: true;

  name = "Angular";
  cx!: CanvasRenderingContext2D;
  canvas = { width: 500, height: 500 };
  currentLocation = { x: 200, y: 200 };
  preDirection!: string;

  // Drawing properties
  strokeColor: string = '#000000';
  lineWidth: number = 2;
  currentTool: 'pencil' | 'line' | 'rectangle' | 'circle' = 'pencil';
  isDrawing = false;
  startX = 0;
  startY = 0;

  // Store drawn shapes
  drawnShapes: Array<{
    type: 'pencil' | 'line' | 'rectangle' | 'circle', 
    startX: number, 
    startY: number, 
    endX: number, 
    endY: number,
    color: string,
    lineWidth: number,
    path?: {x: number, y: number}[] // for pencil tool
  }> = [];

  locationList: Array<{ x: number; y: number }> = [];

  @ViewChild("myCanvas", { static: false }) myCanvas!: ElementRef;

  constructor(private el: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.myCanvas.nativeElement;
    this.cx = canvasEl.getContext("2d")!;

    // Initial style setup
    this.cx.strokeStyle = this.strokeColor;
    this.cx.lineWidth = this.lineWidth;
    this.cx.lineCap = 'round';

    const mouseDown$ = fromEvent<MouseEvent>(canvasEl, "mousedown");
    const mouseMove$ = fromEvent<MouseEvent>(canvasEl, "mousemove");
    const mouseUp$ = fromEvent<MouseEvent>(canvasEl, "mouseup");

    const mouseDraw$ = mouseDown$.pipe(
      tap((e: MouseEvent) => {
        this.isDrawing = true;
        this.startX = e.offsetX;
        this.startY = e.offsetY;
        
        // For pencil tool, start a new path and track points
        if (this.currentTool === 'pencil') {
          this.cx.beginPath(); 
          this.cx.moveTo(e.offsetX, e.offsetY);
          this.drawnShapes.push({
            type: 'pencil',
            startX: e.offsetX,
            startY: e.offsetY,
            endX: e.offsetX,
            endY: e.offsetY,
            color: this.strokeColor,
            lineWidth: this.lineWidth,
            path: [{x: e.offsetX, y: e.offsetY}]
          });
        }
      }),
      concatMap(() => mouseMove$.pipe(takeUntil(mouseUp$)))
    );

    mouseDraw$.subscribe((e: MouseEvent) => {
      if (this.isDrawing) {
        this.enhancedDraw(e.offsetX, e.offsetY);
      }
    });

    // Finalize drawing on mouseup
    mouseUp$.subscribe((e: MouseEvent) => {
      if (this.isDrawing) {
        this.storeFinalShape(e.offsetX, e.offsetY);
        this.isDrawing = false;
      }
    });
  }

  // Enhanced drawing method with multiple tool support
  enhancedDraw(offsetX: number, offsetY: number) {
    if (!this.isDrawing) return;

    this.cx.strokeStyle = this.strokeColor;
    this.cx.lineWidth = this.lineWidth;

    // First, redraw all previous shapes
    this.redrawAllShapes();

    switch(this.currentTool) {
      case 'pencil':
        // Update the last shape (current pencil drawing)
        const lastShape = this.drawnShapes[this.drawnShapes.length - 1];
        if (lastShape && lastShape.type === 'pencil') {
          lastShape.path?.push({x: offsetX, y: offsetY});
          lastShape.endX = offsetX;
          lastShape.endY = offsetY;
          
          this.cx.lineTo(offsetX, offsetY);
          this.cx.stroke();
        }
        break;
      case 'line':
        this.cx.beginPath();
        this.cx.moveTo(this.startX, this.startY);
        this.cx.lineTo(offsetX, offsetY);
        this.cx.stroke();
        break;
      case 'rectangle':
        const width = offsetX - this.startX;
        const height = offsetY - this.startY;
        this.cx.strokeRect(this.startX, this.startY, width, height);
        break;
      case 'circle':
        const radius = Math.sqrt(
          Math.pow(offsetX - this.startX, 2) + 
          Math.pow(offsetY - this.startY, 2)
        );
        this.cx.beginPath();
        this.cx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
        this.cx.stroke();
        break;
    }
  }

  // Method to store the final shape when drawing is complete
  storeFinalShape(offsetX: number, offsetY: number) {
    if (this.currentTool !== 'pencil') {
      const shape = {
        type: this.currentTool,
        startX: this.startX,
        startY: this.startY,
        endX: offsetX,
        endY: offsetY,
        color: this.strokeColor,
        lineWidth: this.lineWidth
      };
      this.drawnShapes.push(shape);
    }
  }

  // Method to redraw all previously drawn shapes
  redrawAllShapes() {
    // Clear the entire canvas first
    this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Redraw each shape
    this.drawnShapes.forEach(shape => {
      this.cx.strokeStyle = shape.color;
      this.cx.lineWidth = shape.lineWidth;

      switch(shape.type) {
        case 'pencil':
          if (shape.path && shape.path.length > 1) {
            this.cx.beginPath();
            this.cx.moveTo(shape.path[0].x, shape.path[0].y);
            shape.path.slice(1).forEach(point => {
              this.cx.lineTo(point.x, point.y);
            });
            this.cx.stroke();
          }
          break;
        case 'line':
          this.cx.beginPath();
          this.cx.moveTo(shape.startX, shape.startY);
          this.cx.lineTo(shape.endX, shape.endY);
          this.cx.stroke();
          break;
        case 'rectangle':
          const width = shape.endX - shape.startX;
          const height = shape.endY - shape.startY;
          this.cx.strokeRect(shape.startX, shape.startY, width, height);
          break;
        case 'circle':
          const radius = Math.sqrt(
            Math.pow(shape.endX - shape.startX, 2) + 
            Math.pow(shape.endY - shape.startY, 2)
          );
          this.cx.beginPath();
          this.cx.arc(shape.startX, shape.startY, radius, 0, 2 * Math.PI);
          this.cx.stroke();
          break;
      }
    });
  }

  // Method to set drawing tool
  setTool(tool: 'pencil' | 'line' | 'rectangle' | 'circle') {
    this.currentTool = tool;
  }

  // Method to change stroke color
  setStrokeColor(event: Event) {
    const target = event.target as HTMLInputElement;
    this.strokeColor = target.value;
  }

  // Method to adjust line width
  setLineWidth(event: Event) {
    const target = event.target as HTMLInputElement;
    this.lineWidth = Number(target.value);
  }

  // Save canvas as image
  saveCanvasAsImage() {
    const canvas = this.myCanvas.nativeElement;
    const image = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = 'canvas-drawing.png';
    link.href = image;
    link.click();
  }

  // Refresh/Clear canvas
  refresh() {
    this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawnShapes = []; // Clear the shapes array
  }

  // Existing methods from original implementation
  autoDraw() {
    const runTimes = 100;
    for (let i = 0; i < runTimes; i++) {
      this.executeAutoDraw();
    }
  }

  executeAutoDraw() {
    const direction = this.getDirection() as keyof typeof DistanceConfig;
    const distance = DistanceConfig[direction];
  
    const newLocation = { ...this.currentLocation };
    newLocation.x = newLocation.x + distance.x;
    newLocation.y = newLocation.y + distance.y;
  
    if (this.isNewPath(newLocation)) {
      console.log(this.currentLocation, newLocation);
      this.cx.moveTo(this.currentLocation.x, this.currentLocation.y);
      this.cx.lineTo(newLocation.x, newLocation.y);
      this.cx.stroke();
  
      this.currentLocation = newLocation;
      this.locationList.push(newLocation);
    }
  }

  isNewPath(newLoc: { x: number; y: number }) {
    const idx = this.locationList.findIndex(
      (oldLoc) => oldLoc.x === newLoc.x && oldLoc.y === newLoc.y
    );
    return idx === -1;
  }

  getDirection(): keyof typeof DistanceConfig {
    const directions = ["up", "left", "down", "right"] as const;
    const idx = Math.floor(Math.random() * 4);
    return directions[idx];
  }
}
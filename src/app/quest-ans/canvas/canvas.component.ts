import { Component, Input } from "@angular/core";
import {
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
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
  viewCanvas!:true

  name = "Angular";
  cx!: CanvasRenderingContext2D;
  canvas = { width: 500, height: 500 };
  currentLocation = { x: 200, y: 200 };
  preDirection!: string;

  locationList: Array<{ x: number; y: number }> = [];

  @ViewChild("myCanvas", { static: false }) myCanvas!: ElementRef;

  constructor(private el: ElementRef) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    const canvasEl: HTMLCanvasElement = this.myCanvas.nativeElement;
    this.cx = canvasEl.getContext("2d")!;

    // Specify MouseEvent type for fromEvent
    const mouseDown$ = fromEvent<MouseEvent>(canvasEl, "mousedown");
    const mouseMove$ = fromEvent<MouseEvent>(canvasEl, "mousemove");
    const mouseUp$ = fromEvent<MouseEvent>(canvasEl, "mouseup");

    const mouseDraw$ = mouseDown$.pipe(
      tap((e: MouseEvent) => {
        this.cx.beginPath(); // Start a new drawing path
        this.cx.moveTo(e.offsetX, e.offsetY);
      }),
      concatMap(() => mouseMove$.pipe(takeUntil(mouseUp$)))
    );

    mouseDraw$.subscribe((e: MouseEvent) => {
      this.draw(e.offsetX, e.offsetY);
    });
  }

  draw(offsetX: number, offsetY: number) {
    this.cx.lineTo(offsetX, offsetY);
    this.cx.stroke();
  }

  autoDraw() {
    const runTimes = 100;
    for (let i = 0; i < runTimes; i++) {
      this.executeAutoDraw();
    }
  }

  executeAutoDraw() {
    // Explicitly typing the direction to be one of the valid keys of DistanceConfig
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
  

  refresh() {
    this.cx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

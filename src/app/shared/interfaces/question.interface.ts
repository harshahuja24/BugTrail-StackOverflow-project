export interface Question{
    id:number,
    title:string,
    description:string,
    tag:string[]
    authorId:number,
    upVote:number,
    downVote:number,
    createdAt:number,
    activeYN:number
}
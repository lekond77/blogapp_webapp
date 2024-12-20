import { Comment } from "./comment";
import { ContentBlock } from "./content_block";
export class Post{
    title!:string;
    code!:string;
    description!:string;
    contentBlock!:ContentBlock[];
    date!:Date;
    comments?:Comment[];
}
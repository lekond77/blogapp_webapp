import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name:'splitBySemicolon'
})
export class SplitBySemicolonPipe implements PipeTransform{

    transform(value: string):string[] {
        return value ? value.split(';').map(item => item.trim()): [];
    }
}
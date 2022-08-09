import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";
@Pipe({ name: 'dateTime' })
export class datetime implements PipeTransform {
    constructor(private datepipe: DatePipe) { }
    transform(value: string) {
        return this.datepipe.transform(value, 'medium')
    }

}
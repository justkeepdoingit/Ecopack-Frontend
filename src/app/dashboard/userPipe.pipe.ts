import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'transformRights'})
export class pipeUserRights implements PipeTransform{
    transform(value: number): string {
        if(value == 1){
            return 'Admin'
        }
        else if(value == 2){
            return 'Employee'
        }
        return 'Default'
    }
}
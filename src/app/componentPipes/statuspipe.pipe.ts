import { Pipe, PipeTransform } from "@angular/core";
import { orderList } from "../models/orderList.model";

@Pipe({ name: 'statusName' })
export class statusName implements PipeTransform {
    transform(value: orderList): string {
        if (value.lineup == false && value.fg == false && value.delivery == false) {
            return 'Planner'
        }
        else if (value.lineup == true && value.fg == false && value.delivery == false) {
            return 'Lineup'
        }
        else if (value.lineup == true && value.converting == true && value.fg == false && value.delivery == false) {
            return 'Converting'
        }
        else if (value.lineup == true && value.fg == true && value.delivery == false) {
            return 'Finished Goods'
        }
        else if (value.lineup == true && value.fg == true && value.delivery == true) {
            return value.shipstatus
        }
        else {
            return 'Default'
        }
    }
}
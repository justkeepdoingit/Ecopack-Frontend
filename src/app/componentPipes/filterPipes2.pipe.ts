import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'filterName2' })
export class filterPipes2 implements PipeTransform {
    transform(value: any): string {
        if (value == 'date') {
            return 'Date'
        }
        else if (value == 'po') {
            return 'PO'
        }
        else if (value == 'so') {
            return 'SO'
        }
        else if (value == 'name') {
            return 'Name'
        }
        else if (value == 'item') {
            return 'Item'
        }
        else if (value == 'itemdesc') {
            return 'Item Description'
        }
        else if (value == 'qty') {
            return 'Order Qty'
        }
        else if (value == 'deliverydate') {
            return 'Date Needed'
        }
        else if (value == 'shipqty') {
            return 'Machine Qty'
        }
        else if (value == 'prodqty') {
            return 'Production Qty'
        }
        return 'Default'
    }
}
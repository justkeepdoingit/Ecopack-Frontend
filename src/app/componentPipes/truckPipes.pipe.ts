import { Pipe, PipeTransform } from "@angular/core";
import { Subject } from "rxjs";
import { AppService } from "../app.service";
@Pipe({ name: 'truckName' })
export class truckPipe implements PipeTransform {
    constructor(private appservice: AppService) { }
    transform(value: any): Subject<string> {
        let truckName = new Subject<string>();
        this.appservice.get1Truck(value).subscribe(data => {
            truckName.next(data.name)
        })

        return truckName

    }
}
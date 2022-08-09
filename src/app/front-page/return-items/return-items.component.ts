import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { returnModel } from 'src/app/models/returnModel.model';
import { FrontPageComponent } from '../front-page.component';

@Component({
  selector: 'app-return-items',
  templateUrl: './return-items.component.html',
  styleUrls: ['./return-items.component.scss']
})
export class ReturnItemsComponent implements OnInit {

  constructor(private frontpage: FrontPageComponent, private appservice: AppService) {
    frontpage.classStatus.planner = false;
    frontpage.classStatus.dashboard = false;
    frontpage.classStatus.statusPage = false
    frontpage.classStatus.editOrders = false;
    frontpage.classStatus.lineup = false;
    frontpage.classStatus.importOrders = false
    frontpage.classStatus.converting = false
    frontpage.classStatus.fg = false
    frontpage.classStatus.delivery = false
    frontpage.classStatus.packing = false
    frontpage.classStatus.returns = true
  }

  displayedColumns: string[] = ['name', 'item', 'qtyship', 'qtyreturn', 'reason', 'action', 'returndate'];
  centered: boolean = false;
  radius: number = 25
  unbounded: boolean = false;
  newDataSource = new MatTableDataSource<returnModel>();
  options: any = [
    { value: 'For Repair', viewValue: 'For Repair' },
    { value: 'For Stock', viewValue: 'For Stock' },
    { value: 'For Disposal', viewValue: 'For Disposal' }
  ]

  returnForm = new FormGroup({});
  returnArray = this.appservice.formBuilder.array([]);

  ngOnInit(): void {
    this.returnForm = this.appservice.formBuilder.group({
      returnArrays: this.returnArray
    })
  }

  dr: string = ''
  returning: boolean = false;

  searchDR() {
    this.appservice.findDr(this.dr).subscribe(record => {
      if (record.length != 0) {
        this.returning = true;
        record.forEach((data: any) => {
          const rows = this.appservice.formBuilder.group({
            receipt: [this.dr],
            orderid: [data.orderid],
            qtyreturn: [data.qtyreturn, Validators.required],
            reason: [data.reason, Validators.required],
            action: [data.action, Validators.required],
            returndate: [data.returndate, Validators.required]
          })
          this.returnArray.push(rows)
        })
        this.newDataSource.data = record
      }
      else {
        this.appservice.snackbar.open(`No Records Found For ${this.dr}`, 'Dismiss', { duration: 2500 })
      }
    })
  }

  saveReturn(element: any) {
    this.appservice.saveReturn(element.returnArrays).subscribe(() => {
      this.appservice.snackbar.open('Return Updated!', 'Dismiss', { duration: 2500 });
      this.newDataSource.data = [];
      this.dr = '';
    })
  }

}

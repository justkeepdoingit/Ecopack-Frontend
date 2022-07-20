import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { orderList } from 'src/app/models/orderList.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-lineup-dialog',
  templateUrl: './lineup-dialog.component.html',
  styleUrls: ['./lineup-dialog.component.scss']
})
export class LineupDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private orderList: orderList, private appservice: AppService,
    private dialogRef: MatDialogRef<LineupDialogComponent>, private datepipe: DatePipe) {
    this.lineupList = orderList
  }



  lineupList: orderList;
  lineupOrders = new UntypedFormGroup({})
  ngOnInit(): void {
    this.lineupOrders = this.appservice.formBuilder.group({
      shipqty: [this.lineupList.shipqty, Validators.required],
      qty: [this.lineupList.qty],
      itemdesc: [this.lineupList.itemdesc],
      comment: [this.lineupList.comment]
    })
  }

  updateData(data: orderList) {
    let link = `http://localhost:3000/order-list/updateOrder/${this.lineupList.id}`
    this.appservice.orderPatch(link, data).subscribe()
    this.appservice.snackbar.open(`PO # ${this.lineupList.po} details has been updated`, 'Dismiss', { duration: 2500 })
    this.dialogRef.close(1)
  }

  orderMoveFG() {
    let link = `http://localhost:3000/order-list/fg/`
    let newData: orderList[] = [this.lineupList];
    this.appservice.movementPost(link, newData).subscribe()
    this.appservice.snackbar.open(`PO # ${this.lineupList.id} was moved to Finished Goods`, 'Okay', { duration: 2500 })
    this.dialogRef.close(1)
  }
  orderMoveCon() {
    let link = `http://localhost:3000/order-list/convert/`
    let newData: orderList[] = [this.lineupList];
    this.appservice.movementPost(link, newData).subscribe()
    this.appservice.snackbar.open(`PO # ${this.lineupList.id} was moved to Converting`, 'Okay', { duration: 2500 })
    this.dialogRef.close(1)
  }

}

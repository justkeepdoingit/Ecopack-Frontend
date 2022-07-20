import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { orderList } from 'src/app/models/orderList.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-fg-dialog',
  templateUrl: './fg-dialog.component.html',
  styleUrls: ['./fg-dialog.component.scss']
})
export class FgDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private orderList: orderList[], private appservice: AppService,
    private dialogRef: MatDialogRef<FgDialogComponent>, private datepipe: DatePipe
  ) {
    this.orderListInfo = orderList

  }
  orderListInfo: orderList[] = [];

  dateComment = new UntypedFormGroup({})

  minDate = new Date()
  newDate = new Date();
  DateTime = this.newDate.setDate(this.newDate.getDate() + 2)
  ngOnInit(): void {
    this.dateComment = this.appservice.formBuilder.group({
      deliverydate: [this.datepipe.transform(this.DateTime, 'yyyy-MM-dd'), Validators.required],
      comment: [this.orderList[0].comment]
    })
  }


  updateData(edit: orderList) {
    let newData = {
      deliverydate: this.datepipe.transform(edit.deliverydate, 'yyyy-MM-dd'),
      comment: edit.comment
    }

    this.orderListInfo.forEach(data => {
      let link = `../../api/order-list/updateOrder/${data.id}`;
      this.appservice.orderPatch(link, newData).subscribe(datas => {
        this.dialogRef.close(1);
      })
    })
  }

  moveToDelivery() {
    let link = `../../api/order-list/delivery/`

    this.orderListInfo.forEach(data => {
      this.appservice.movementPost(link, this.orderListInfo).subscribe()
      this.dialogRef.close(1);
    })

    this.appservice.snackbar.open(`PO # ${this.orderList[0].id} was moved for Delivery`, 'Okay', { duration: 2500 })
  }
}

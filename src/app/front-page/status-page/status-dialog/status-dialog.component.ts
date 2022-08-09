import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { orderList } from 'src/app/models/orderList.model';
import { DatePipe } from '@angular/common';
import { deliveryModel } from 'src/app/models/deliveryModel.mode';

@Component({
  selector: 'app-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss']
})
export class StatussDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private orderList: any, private appservice: AppService,
    private dialogRef: MatDialogRef<StatussDialogComponent>, private datepipe: DatePipe
  ) {
    this.orderListInfo = [orderList.order]
    this.deliveryInfo = orderList.delivery
    this.sw = orderList.sw
  }
  orderListInfo: orderList[] = [];
  deliveryInfo: any[] = []
  sw: number;
  totalQty: number = 0;
  returnQty: number = 0;
  ngOnInit(): void {
    this.deliveryInfo.forEach(data => {
      this.totalQty += data.qtyship
      this.returnQty += data.qtyreturn
    })
  }

  pipeTransform(element: any) {
    return this.datepipe.transform(element, 'medium')
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { orderList } from 'src/app/models/orderList.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-edit-dialog',
  templateUrl: './order-edit-dialog.component.html',
  styleUrls: ['./order-edit-dialog.component.scss']
})
export class OrderEditDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private orderList: any, private appservice: AppService,
    private dialogRef: MatDialogRef<OrderEditDialogComponent>, private datepipe: DatePipe
  ) {
    this.orderListInfo = orderList.orders
    this.deliveryInfo = orderList.delivery
    console.log(orderList);
  }
  orderListInfo: orderList;
  deliveryInfo: any[] = []
  orderEdit = new UntypedFormGroup({});

  inputList: any = ['Order Date', 'PO', 'SO', 'Customer Name', 'Item', 'Item Description', 'Order Qty', 'Machine Qty',
    'Status', 'Last Update', 'DR#', 'Qty Delivered', 'Delivery Date'];
  DropdownList: any = ['Lineup', 'Converting', 'FG', 'Delivery'];

  formName = ['date', 'po', 'so', 'name', 'item', 'itemdesc', 'qty', 'prodqty', 'shipstatus', 'lastedited', 'receipt',
    'qtydeliver', 'deliverydate'
  ]
  dropdownName = ['lineup', 'converting', 'fg', 'delivery'];

  options: any = [
    { value: true, viewValue: 'Yes' },
    { value: false, viewValue: 'No' }
  ]
  ngOnInit(): void {
    console.log(this.deliveryInfo);
    let qty = 0;

    this.deliveryInfo.forEach(data => {
      qty += data.forDelivery_qtyship;
    })

    this.orderEdit = this.appservice.formBuilder.group({
      id: [this.orderListInfo.id],
      date: [this.orderListInfo.date],
      po: [this.orderListInfo.po],
      so: [this.orderListInfo.so],
      name: [this.orderListInfo.name],
      item: [this.orderListInfo.item],
      itemdesc: [this.orderListInfo.itemdesc],
      qty: [this.orderListInfo.qty],
      prodqty: [this.orderListInfo.prodqty],
      lastedited: [this.orderListInfo.lastedited],
      shipstatus: [this.orderListInfo.shipstatus],
      receipt: [this.deliveryInfo[0]?.forDelivery_receipt],
      qtydeliver: [qty],
      deliverydate: [this.orderListInfo.deliverydate],
      lineup: [this.orderListInfo.lineup],
      converting: [this.orderListInfo.converting],
      fg: [this.orderListInfo.fg],
      delivery: [this.orderListInfo.delivery]
    })
  }

  saveEdit(element: any) {
    this.appservice.updateWhole(element).subscribe(data => {
      this.dialogRef.close(1);
    });
  }


}

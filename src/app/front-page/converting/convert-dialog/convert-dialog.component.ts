import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { orderList } from 'src/app/models/orderList.model';
import { DatePipe } from '@angular/common';
import { rejectList } from 'src/app/models/rejectList.model';

@Component({
  selector: 'app-convert-dialog',
  templateUrl: './convert-dialog.component.html',
  styleUrls: ['./convert-dialog.component.scss']
})
export class ConvertDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private orderList: any, private appservice: AppService,
    private dialogRef: MatDialogRef<ConvertDialogComponent>, private datepipe: DatePipe) {
    this.convertList = orderList.data
    this.sw = orderList.sw;
    this.rejectList = orderList.reject
    this.multiList = orderList.data
  }

  convertList: orderList;
  rejectList: rejectList;
  multiList: orderList[] = [];

  convertOrders = new UntypedFormGroup({})
  qtyEdit = new UntypedFormGroup({})
  cpof = new UntypedFormGroup({})
  muliOrders = new UntypedFormGroup({})

  sw: number = 0;

  ngOnInit(): void {
    if (this.sw == 1) {
      this.convertOrders = this.appservice.formBuilder.group({
        item: [this.convertList.item],
        creasingr: [this.rejectList.creasingr],
        printingr: [this.rejectList.printingr],
        dcr: [this.rejectList.dcr],
        finishr: [this.rejectList.finishr],
        corr: [this.rejectList.corr],
        corl: [this.rejectList.corl],
        comment: [this.rejectList.comment]
      })
    }
    else if (this.sw == 2) {
      this.qtyEdit = this.appservice.formBuilder.group({
        prodqty: [this.convertList.shipqty, Validators.required],//updating shipqty
        qty: [this.convertList.qty],
        itemdesc: [this.convertList.itemdesc],
        comment: [this.convertList.comment]
      })
    }

    else if (this.sw == 3) {
      this.cpof = this.appservice.formBuilder.group({
        c: [this.convertList.c],
        p: [this.convertList.p],
        o: [this.convertList.o],
        f: [this.convertList.f]
      })
    }

    else {
      this.muliOrders = this.appservice.formBuilder.group({
        shipqty: [''],
        qty: [''],
        itemdesc: [''],
        comment: ['']
      })
    }
  }

  updateReject(data: rejectList) {
    this.appservice.updateReject(data, this.convertList.id).subscribe()
    this.appservice.snackbar.open(`PO # ${this.convertList.po} details has been updated`, 'Dismiss', { duration: 2500 })
    this.dialogRef.close(1)
  }

  updateQty(data: orderList) {
    let link = `../../api/order-list/updateOrder/${this.convertList.id}`
    this.appservice.orderPatch(link, data).subscribe()
    this.appservice.snackbar.open(`PO # ${this.convertList.po} details has been updated`, 'Dismiss', { duration: 2500 })
    this.dialogRef.close(1)
  }

  updateStatus(data: orderList) {
    this.updateQty(data)
  }

  // updateData(edit: orderList){
  //   let newData = {
  //     deliverydate: this.datepipe.transform(edit.deliverydate, 'yyyy-MM-dd'),
  //     comment: edit.comment
  //   }

  //   this.multiList.forEach(data=>{
  //     let link = `../../api/order-list/updateOrder/${data.id}`;
  //     this.appservice.orderPatch(link, newData).subscribe(datas=>{
  //       this.dialogRef.close(1);
  //     })
  //   })    
  // }

}

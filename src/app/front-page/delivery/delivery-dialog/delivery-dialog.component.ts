
import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { orderList } from 'src/app/models/orderList.model';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { shippingList } from 'src/app/models/shippingMode.model';
import { pickingModel } from 'src/app/models/pickingModel.model';
@Component({
  selector: 'app-delivery-dialog',
  templateUrl: './delivery-dialog.component.html',
  styleUrls: ['./delivery-dialog.component.scss']
})
export class DeliveryDialogComponent implements OnInit, AfterViewInit {

  constructor(@Inject(MAT_DIALOG_DATA) private shippingList: shippingList[], private appservice: AppService,
    private dialogRef: MatDialogRef<DeliveryDialogComponent>, private datepipe: DatePipe
  ) {
    this.shippingListInfo = shippingList
    this.newDataSource.data = shippingList


  }
  newDataSource = new MatTableDataSource<shippingList>();
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) matsort: MatSort = new MatSort()

  shippingListInfo: shippingList[] = [];

  displayedColumns: string[] = ['item', 'qty', 'status'];

  centered: boolean = false;
  radius: number = 25
  unbounded: boolean = false;

  dateComment = new UntypedFormGroup({})

  minDate = new Date()
  newDate = new Date();
  DateTime = this.newDate.setDate(this.newDate.getDate() + 2)

  formGroupRows = this.appservice.formBuilder.array([]);

  ngOnInit(): void {
    this.shippingListInfo.forEach((data) => {
      const rows = this.appservice.formBuilder.group({
        id: [data.id],
        qty: [(data.prodqty - data.deliveryqty), Validators.required],
        deliverySelect: ['', Validators.required]
      })
      this.formGroupRows.push(rows)
    })

    this.dateComment = this.appservice.formBuilder.group({
      deliverydate: [this.datepipe.transform(this.DateTime, 'yyyy-MM-dd'), Validators.required],
      receipt: ['', Validators.required],
      infodata: this.formGroupRows

    })
  }

  ngAfterViewInit(): void {
    this.newDataSource.paginator = this.paginator
    this.newDataSource.sort = this.matsort
  }


  updateData(edit: any) {
    let i = 0;
    this.shippingListInfo.forEach(data => {
      let newData = {
        deliverydate: edit.deliverydate,
        receipt: edit.receipt,
        qty: edit.infodata[i].qty,
        status: edit.infodata[i].deliverySelect,
        orderid: data.id,
        itemid: data.item
      }
      i++;
      let link = `https://ecopack2.herokuapp.com/order-list/updateDelivery`;
      this.appservice.getGeneralData(link, newData).subscribe(datas => {
        this.dialogRef.close(1);
      })
    })
  }

}

import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { orderList } from 'src/app/models/orderList.model';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-printdr-dialog',
  templateUrl: './printdr-dialog.component.html',
  styleUrls: ['./printdr-dialog.component.scss']
})
export class PrintdrDialogComponent implements OnInit, AfterViewInit {

  constructor(@Inject(MAT_DIALOG_DATA) private orderList: orderList[], private appservice: AppService,
    private dialogRef: MatDialogRef<PrintdrDialogComponent>, public datepipe: DatePipe
  ) {
    this.orderListInfo = orderList
    this.newDataSource.data = orderList
  }
  newDataSource = new MatTableDataSource<orderList>();
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) matsort: MatSort = new MatSort()

  orderListInfo: any[] = [];

  displayedColumns: string[] = ['receipt', 'so', 'po', 'name', 'item', 'itemdesc', 'qtyship', 'shipstatus'];


  centered: boolean = false;
  radius: number = 25
  unbounded: boolean = false;

  dateComment = new UntypedFormGroup({})

  noDr: boolean = false;
  minDate = new Date()
  newDate = new Date();
  DateTime = this.newDate.setDate(this.newDate.getDate() + 2)

  formGroupRows = this.appservice.formBuilder.array([]);

  ngOnInit(): void {
    this.orderListInfo.forEach((data) => {
      if (data.receipt == null) {
        this.noDr = true
      }
      const rows = this.appservice.formBuilder.group({
        id: [data.id],
        orderid: [data.orderid],
        itemid: [data.item],
        qty: [data.qtyship, Validators.required],
        deliverySelect: [data.shipstatus, Validators.required]
      })
      this.formGroupRows.push(rows)
    })

    this.dateComment = this.appservice.formBuilder.group({
      deliverydate: [this.datepipe.transform(this.DateTime, 'yyyy-MM-dd'), Validators.required],
      infodata: this.formGroupRows
    })
  }

  ngAfterViewInit(): void {
    this.newDataSource.paginator = this.paginator
    this.newDataSource.sort = this.matsort
  }


  updateData(edit: any) {
    let i = 0;
    edit.infodata.forEach((data: any) => {
      let newData = {
        id: edit.infodata[i].id,
        deliverydate: edit.deliverydate,
        shipstatus: edit.infodata[i].deliverySelect,
        orderid: edit.infodata[i].id,
        qtyship: edit.infodata[i].qty,
        itemid: edit.infodata[i].itemid
      }
      let link = `https://ecopack2.herokuapp.com/order-list/updateShippingPl`;
      this.appservice.getGeneralData(link, newData).subscribe(datas => {
        this.dialogRef.close(1);
      })
      i++;
    })
  }

}

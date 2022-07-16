import { Component, OnInit, ViewChild,Inject, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { orderList } from 'src/app/models/orderList.model';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';


@Component({
  selector: 'app-status-dialog',
  templateUrl: './status-dialog.component.html',
  styleUrls: ['./status-dialog.component.scss']
})
export class StatusDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private orderList: orderList[], private appservice: AppService,
  private dialogRef: MatDialogRef<StatusDialogComponent>, private datepipe: DatePipe
  ) {
    this.orderListInfo = orderList
    this.newDataSource.data = orderList
   }
   newDataSource = new MatTableDataSource<orderList>();
   @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
   @ViewChild(MatSort) matsort: MatSort = new MatSort()

   orderListInfo: any[] = [];

   displayedColumns: string[] = ['item','qty','status'];

  centered: boolean = false;
  radius: number = 25
  unbounded: boolean = false;

  dateComment = new UntypedFormGroup({})
  
  minDate = new Date()
  newDate = new Date();
  DateTime = this.newDate.setDate(this.newDate.getDate() + 2)

  formGroupRows = this.appservice.formBuilder.array([]);
  
  ngOnInit(): void {
    this.orderListInfo.forEach((data)=>{
      const rows = this.appservice.formBuilder.group({
        id: [data.forDelivery_id],
        qty: [data.forDelivery_qtyship,Validators.required],
        deliverySelect: [data.forDelivery_shipstatus,Validators.required]
      })
      this.formGroupRows.push(rows)
    })
    
    this.dateComment = this.appservice.formBuilder.group({
      deliverydate: [this.datepipe.transform(this.DateTime, 'yyyy-MM-dd'), Validators.required],
      deliveryAll: ['Partial Delivery', Validators.required],
      infodata: this.formGroupRows
    })
  }

  ngAfterViewInit(): void {
    this.newDataSource.paginator = this.paginator
    this.newDataSource.sort = this.matsort
  }


  updateData(edit: any){
    let i = 0;
    this.orderListInfo.forEach(data=>{
      let newData = {
        id: edit.infodata[i].id,
        deliverydate: edit.deliverydate,
        qtyship: edit.infodata[i].qty,
        status: edit.deliveryAll,
        shipstatus: edit.infodata[i].deliverySelect,
        orderid: data.forDelivery_orderid,
        itemid: data.forDelivery_itemid
      }
      i++;
      let link = `http://localhost:3000/order-list/updateShipping`;
      this.appservice.getGeneralData(link, newData).subscribe(datas=>{
        this.dialogRef.close(1);
      })
    }) 
  }

}

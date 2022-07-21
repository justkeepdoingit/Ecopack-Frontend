import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { packingModel } from 'src/app/models/packingModel.model';
import { pickingModel2 } from 'src/app/models/pickingModel.model';

@Component({
  selector: 'app-print-dialog',
  templateUrl: './print-dialog.component.html',
  styleUrls: ['./print-dialog.component.scss']
})
export class PrintDialogComponent implements OnInit, AfterViewInit {

  constructor(@Inject(MAT_DIALOG_DATA) private packing: any, private appservice: AppService,
    private dialogRef: MatDialogRef<PrintDialogComponent>, public datepipe: DatePipe) {
    this.packingInfo = packing.pld
    this.newDataSource.data = packing.pld;
    this.truckInfo = packing.pl;
  }

  centered: boolean = false;
  radius: number = 25
  unbounded: boolean = false;

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.newDataSource.paginator = this.paginator
    this.newDataSource.sort = this.matsort
  }
  temporaryData: any[] = []
  truckInfo: packingModel;

  checkboxChecked(checked: boolean, data: any) {
    if (!checked) {
      for (let i = 0; i < this.temporaryData.length; i++) {
        if (data.id == this.temporaryData[i].id) {
          this.temporaryData.splice(i, 1)
          break;
        }
      }
    }
    else {
      this.temporaryData.push(data)
    }
    console.log(this.temporaryData);
  }

  displayedColumns: string[] = ['cb', 'date', 'po', 'name', 'item', 'itemdesc', 'qty', 'qtydeliver', 'volume', 'volumet'];

  newDataSource = new MatTableDataSource<pickingModel2>();
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) matsort: MatSort = new MatSort()

  packingInfo: pickingModel2[] = [];
}

import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { packingModel } from 'src/app/models/packingModel.model';
import { pickingModel2 } from 'src/app/models/pickingModel.model';
import { truckPipe } from 'src/app/componentPipes/truckPipes.pipe';
@Component({
  selector: 'app-print-dialog',
  templateUrl: './print-dialog.component.html',
  styleUrls: ['./print-dialog.component.scss']
})
export class PrintDialogComponent implements OnInit, AfterViewInit {

  constructor(@Inject(MAT_DIALOG_DATA) private packing: any, private appservice: AppService,
    private dialogRef: MatDialogRef<PrintDialogComponent>, public datepipe: DatePipe, private truckpipe: truckPipe) {
    this.packingInfo = packing.pld
    this.newDataSource.data = packing.pld;
    this.truckInfo = packing.pl;
    this.temporaryData = packing.pld
  }

  centered: boolean = false;
  radius: number = 25
  unbounded: boolean = false;

  prio = new FormGroup({})
  prioArrange: any = new FormArray([])
  ngOnInit(): void {
    this.packingInfo.forEach((data) => {
      const arrays = this.appservice.formBuilder.group({
        prio: [data.prio, Validators.required],
        id: [data.id]
      })
      this.prioArrange.push(arrays)
    })

    this.prio = this.appservice.formBuilder.group({
      prioArrange: this.prioArrange
    })

  }

  ngAfterViewInit(): void {
    this.newDataSource.paginator = this.paginator
    this.newDataSource.sort = this.matsort
  }
  temporaryData: any[] = []
  truckInfo: packingModel;

  spliceName(name: string) {
    return name.slice(0, 10)
  }

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

  displayedColumns: string[] = ['prio', 'date', 'po', 'name', 'item', 'qty', 'qtydeliver', 'volume', 'volumet'];

  newDataSource = new MatTableDataSource<pickingModel2>();
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) matsort: MatSort = new MatSort()

  packingInfo: pickingModel2[] = [];

  saveDR(data: any) {

    var prioArrangement: any[] = [];

    data.prioArrange.forEach((data: any) => {
      let newPrio = {
        prio: data.prio,
        id: data.id
      }
      prioArrangement.push(newPrio)
    })

    prioArrangement.forEach((data: any, index: number) => {
      this.temporaryData[index].prio = data.prio;
    })

    let newData = this.temporaryData.map((data) => (
      data
    )).sort((a: any, b: any) => { return a.prio - b.prio });

    this.temporaryData = newData

    let truckName = this.truckInfo.truck;
    this.truckpipe.transform(truckName).subscribe(data => {
      this.appservice.snackbar.open(`Order Update For ${data}`, 'Dismiss', { duration: 2500 })
    })

    this.appservice.updatePrio(prioArrangement).subscribe(() => {
      this.appservice.getTruckInfo2(this.temporaryData[0].plid).subscribe(item => {

      })
    })
  }

}

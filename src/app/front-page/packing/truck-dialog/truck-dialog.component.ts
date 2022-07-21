import { Component, OnInit, ViewChild, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormGroupDirective, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { DatePipe } from '@angular/common';
import { packingModel } from 'src/app/models/packingModel.model';
import { truckModel } from 'src/app/models/truckModel.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
@Component({
  selector: 'app-truck-dialog',
  templateUrl: './truck-dialog.component.html',
  styleUrls: ['./truck-dialog.component.scss']
})
export class TruckDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private packing: packingModel, private appservice: AppService,
    private dialogRef: MatDialogRef<TruckDialogComponent>, private datepipe: DatePipe) { }

  truckInfo = new UntypedFormGroup({})

  displayedColumns: any[] = ['name', 'plate', 'desc', 'ban', 'capacity']
  newDatasource = new MatTableDataSource<truckModel>()
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) matsort: MatSort = new MatSort()

  refreshData() {
    this.appservice.getTrucks().subscribe(data => {
      this.newDatasource.data = data
      this.newDatasource.paginator = this.paginator
      this.newDatasource.sort = this.matsort
    })
  }

  ngOnInit(): void {
    this.truckInfo = this.appservice.formBuilder.group({
      name: ['', Validators.required],
      plate: ['', Validators.required],
      desc: ['', Validators.required],
      ban: ['', Validators.required],
      capacity: ['', Validators.required]
    })

    this.refreshData()
  }

  unbounded: boolean = false;
  radius: number = 25;
  centered: boolean = false;


  addTruck(data: truckModel, fd: FormGroupDirective) {
    this.appservice.saveTruck(data).subscribe(data => {
      this.appservice.getTrucks().subscribe(data => {
        this.newDatasource.data = data
        this.newDatasource.paginator = this.paginator
        this.newDatasource.sort = this.matsort
        fd.resetForm()
        this.appservice.snackbar.open("Truck Added!", "Dismiss", { duration: 2500 })
      })
    })
  }

  applyFilter(event: Event) {
    let filter = (event.target as HTMLInputElement).value.toLowerCase();
    this.newDatasource.filter = filter;
  }

}

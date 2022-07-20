import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { itemModel } from 'src/app/models/itemMode.model';

@Component({
  selector: 'app-volume-dialog',
  templateUrl: './volume-dialog.component.html',
  styleUrls: ['./volume-dialog.component.scss']
})
export class VolumeDialogComponent implements OnInit {

  constructor(private appservice: AppService) { }

  volumeData = new UntypedFormGroup({})

  ngOnInit(): void {
    this.refreshData();

    this.volumeData = this.appservice.formBuilder.group({
      id: [''],
      itemid: [''],
      volume: ['', Validators.required]
    })
  }

  refreshData() {
    this.appservice.getVolume().subscribe(data => {
      this.newDataSource.data = data;
      this.newDataSource.paginator = this.paginator
      this.newDataSource.sort = this.matsort
    })
  }


  displayedColumns: any[] = ['itemid', 'volume']
  newDataSource = new MatTableDataSource<itemModel>()
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) matsort: MatSort = new MatSort()

  unbounded: boolean = false;
  radius: number = 25;
  centered: boolean = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.newDataSource.filter = filterValue.trim().toLowerCase();
  }

  editVolume(data: itemModel, fd: FormGroupDirective) {
    this.appservice.updateVolume(data).subscribe(() => {
      this.appservice.getVolume().subscribe(data => {
        this.newDataSource.data = data;
        this.newDataSource.paginator = this.paginator
        this.newDataSource.sort = this.matsort
      })
      this.appservice.snackbar.open('Data Updated', 'Dismiss', { duration: 2500 })
    })
  }

  updateData(data: itemModel) {
    this.volumeData.patchValue({
      id: data.id,
      itemid: data.itemid,
      volume: data.volume
    })
  }

}

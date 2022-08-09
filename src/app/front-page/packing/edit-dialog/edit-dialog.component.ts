import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { pickingModel2 } from 'src/app/models/pickingModel.model';
import { truckModel, truckSelect } from 'src/app/models/truckModel.model';
import { AddListDialogComponent } from './add-list-dialog/add-list-dialog.component';
import { truckPipe } from 'src/app/componentPipes/truckPipes.pipe';
@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private packing: any, private appservice: AppService,
    private dialogRef: MatDialogRef<EditDialogComponent>, public datepipe: DatePipe, private truck: truckPipe) {
    this.newDataSource.data = packing.pld;
    this.packingInfo = packing.pld

    let truckNames = truck.transform(packing.pl.truck).subscribe(data => {
      appservice.snackbar.open(`Editing Data For ${data}`, 'Dismiss')

    })

  }

  newDataSource = new MatTableDataSource<pickingModel2>();
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) matsort: MatSort = new MatSort()

  packingInfo: pickingModel2[] = [];

  displayedColumns: string[] = ['date', 'po', 'name', 'item', 'itemdesc', 'qty', 'qtydeliver', 'volume', 'volumet'];

  centered: boolean = false;
  radius: number = 25
  unbounded: boolean = false;

  minDate = new Date()
  newDate = new Date();
  DateTime = this.newDate.setDate(this.newDate.getDate() + 2)

  formGroupRows = this.appservice.formBuilder.array([]);
  packingGroup = new UntypedFormGroup({})



  changeColor(c: number) {
    if (c < 60) {
      this.styles = 'red'
    }
    else if (c > 61 && c < 80) {
      this.styles = 'yellow'
    }
    else {
      this.styles = 'green'
    }
  }
  truckName = this.packing.pl.truck;
  ngOnInit(): void {
    this.packingGroup = this.appservice.formBuilder.group({
      id: [this.packing.pl.id],
      date: [this.packing.pl.date, Validators.required],
      truck: [this.packing.pl.truck, Validators.required],
      capacity: [this.packing.pl.capacity],
      total: [this.packing.pl.total],
      percent: [this.packing.pl.percent],
      infodata: this.formGroupRows
    })

    this.appservice.getTrucks().subscribe(data => {
      data.forEach(trucks => {
        let truckData = {
          value: trucks.id,
          viewValue: `${trucks.name} - ${trucks.plate} - ${trucks.capacity}`
        }
        this.trucks.push(truckData)
      })
      this.truckInfos = [...data];
    })

    this.packingInfo.forEach((data) => {
      const rows = this.appservice.formBuilder.group({
        id: [data.id],
        qtydeliver: [data.qtydeliver, Validators.required],
        name: [data.name]
      })
      this.formGroupRows.push(rows)
    })
    let c = this.packingGroup.controls['percent'].value;
    this.changeColor(c);
  }

  getValue(data: any) {
    try {
      return this.formGroupRows.controls[data].value.qtydeliver;
    } catch (error) {
      console.log('False Error')
    }

  }

  styles: string = '';
  deleting: boolean = false;
  updateTotal(value: Event, data: pickingModel2) {
    const filterValue = (value.target as HTMLInputElement).value;
    let volumes = 0;
    let i = 0
    this.formGroupRows.controls.forEach(data => {
      volumes += (parseInt(data.value.qtydeliver) * parseFloat(this.packingInfo[i]!.volume))
      i++
    })


    let a = this.packingGroup.controls['capacity'].value;
    let c = (volumes / a) * 100;

    this.changeColor(c);
    this.packingGroup.patchValue({
      total: volumes.toLocaleString(),
      percent: c.toLocaleString()
    })
  }

  ngAfterViewInit(): void {
    this.newDataSource.paginator = this.paginator
    this.newDataSource.sort = this.matsort
  }


  editData(data: any) {
    let total = data.total.toString()
    let percent = data.percent.toString()

    let truckInfo = {
      id: data.id,
      name: '',
      truck: data.truck,
      date: this.datepipe.transform(data.date, 'yyyy-MM-dd'),
      capacity: data.capacity,
      total: total.replace(',', ''),
      percent: percent.replace(',', '')
    }
    let delivery: any[] = [];

    data.infodata.forEach((item: any) => {
      truckInfo.name.includes(item.name) ? '' : truckInfo.name += item.name + '/'

      let truckDetails = {
        plid: item.id,
        qtydeliver: item.qtydeliver
      }
      delivery.push(truckDetails);
    })
    this.appservice.editPacking(truckInfo, delivery).subscribe(() => {
      this.dialogRef.close(1)
    })
  }


  truckInfos: truckModel[] = [];

  trucks: truckSelect[] = [];
  filteredTrucks: truckSelect[] = [];
  searching: boolean = false;
  filterTrucks(data: Event) {
    const filterValue = (data.target as HTMLInputElement).value.toLowerCase();

    this.searching = filterValue.length == 0 ? false : true;

    let filter = this.trucks.filter(data => {
      return data.viewValue.toLowerCase().includes(filterValue);
    })

    this.filteredTrucks = filter;
  }

  truckSelect(datas: any) {
    let trucks = this.truckInfos.filter(data => {
      return data.id == datas;
    })

    let a = trucks[0].capacity;
    let b = this.packingGroup.controls['total'].value;
    let c = (b / a) * 100;

    this.changeColor(c);


    this.packingGroup.patchValue({
      capacity: trucks[0].capacity,
      percent: c.toLocaleString()
    })
  }

  addList(data: any) {
    let dialog = this.appservice.dialog.open(AddListDialogComponent, {
      data: data.id
    })

    dialog.afterClosed().subscribe(check => {
      if (check) {
        this.formGroupRows.clear();

        let a = 0;
        let b = this.packingGroup.controls['capacity'].value;


        this.appservice.getTruckInfo2(check).subscribe(item => {
          this.newDataSource.data = item
          this.packingInfo = item;

          this.packingInfo.forEach((data) => {
            const rows = this.appservice.formBuilder.group({
              id: [data.id],
              qtydeliver: [data.qtydeliver, Validators.required],
              name: [data.name]
            })
            this.formGroupRows.push(rows)
            a += (parseFloat(data.volume) * parseInt(data.qtydeliver));
          })

          let c = (a / b) * 100

          this.packingGroup.patchValue({
            total: a.toLocaleString(),
            percent: c.toLocaleString(),
          })

          this.changeColor(c);
        })
      }
    })
  }

  deletePld(data: any) {
    this.appservice.deletePld(data.id).subscribe(() => {
      this.formGroupRows.clear();

      let a = 0;
      let b = this.packingGroup.controls['capacity'].value;

      this.appservice.getTruckInfo2(data.plid).subscribe(item => {
        this.newDataSource.data = item
        this.packingInfo = item;

        this.packingInfo.forEach((data) => {
          const rows = this.appservice.formBuilder.group({
            id: [data.id],
            qtydeliver: [data.qtydeliver, Validators.required],
            name: [data.name]
          })
          this.formGroupRows.push(rows)
          a += (parseFloat(data.volume) * parseInt(data.qtydeliver));
        })
        let c = (a / b) * 100

        this.packingGroup.patchValue({
          total: a.toLocaleString(),
          percent: c.toLocaleString(),
        })

        this.changeColor(c);
      })
    })
  }

}

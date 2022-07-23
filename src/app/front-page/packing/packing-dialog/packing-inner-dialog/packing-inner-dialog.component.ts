import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { pickingModel } from 'src/app/models/pickingModel.model';
import { truckModel, truckSelect } from 'src/app/models/truckModel.model';

@Component({
  selector: 'app-packing-inner-dialog',
  templateUrl: './packing-inner-dialog.component.html',
  styleUrls: ['./packing-inner-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PackingInnerDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private packing: pickingModel[], private appservice: AppService,
    private dialogRef: MatDialogRef<PackingInnerDialogComponent>, public datepipe: DatePipe) {
    this.newDataSource.data = packing;
    this.packingInfo = packing
  }

  newDataSource = new MatTableDataSource<pickingModel>();
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) matsort: MatSort = new MatSort()

  packingInfo: pickingModel[] = [];

  displayedColumns: string[] = ['date', 'po', 'name', 'item', 'itemdesc', 'qty', 'pendingqty', 'volume', 'volumet'];

  centered: boolean = false;
  radius: number = 25
  unbounded: boolean = false;


  minDate = new Date()
  newDate = new Date();
  DateTime = this.newDate.setDate(this.newDate.getDate() + 2)

  formGroupRows = this.appservice.formBuilder.array([]);
  packingGroup = new UntypedFormGroup({})

  ngOnInit(): void {
    this.packingGroup = this.appservice.formBuilder.group({
      date: [this.datepipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      truck: ['', Validators.required],
      capacity: ['', Validators.required],
      total: ['', Validators.required],
      percent: ['', Validators.required],
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
        pendingqty: [data.pendingqty, Validators.required],
        name: [data.name]
      })
      this.formGroupRows.push(rows)
    })
  }

  getValue(data: any) {
    return this.formGroupRows.controls[data].value.pendingqty;
  }
  styles: string = '';
  updateTotal(value: Event, data: pickingModel) {
    const filterValue = (value.target as HTMLInputElement).value;
    let volumes = 0;
    let i = 0
    this.formGroupRows.controls.forEach(data => {
      volumes += (parseInt(data.value.pendingqty) * parseFloat(this.packingInfo[i].volume))
      i++
    })

    let a = this.packingGroup.controls['capacity'].value;
    let c = (volumes / a) * 100;

    if (c < 60) {
      this.styles = 'red'
    }
    else if (c > 61 && c < 80) {
      this.styles = 'yellow'
    }
    else {
      this.styles = 'green'
    }
    this.packingGroup.patchValue({
      total: volumes.toLocaleString(),
      percent: c.toLocaleString()
    })
  }

  ngAfterViewInit(): void {
    this.newDataSource.paginator = this.paginator
    this.newDataSource.sort = this.matsort
  }


  saveData(data: any) {
    let truckInfo = {
      name: '',
      truck: data.truck,
      date: this.datepipe.transform(data.date, 'yyyy-MM-dd'),
      capacity: data.capacity.toString().replace(',', ''),
      total: data.total.toString().replace(',', ''),
      percent: data.percent.toString().replace(',', '')
    }
    let delivery: any[] = [];

    data.infodata.forEach((item: any) => {
      truckInfo.name.includes(item.name) ? '' : truckInfo.name += item.name + '/'

      let truckDetails = {
        orderid: item.id,
        qtydeliver: item.pendingqty
      }
      delivery.push(truckDetails);
    })
    this.appservice.savePacking(truckInfo, delivery).subscribe(() => {
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

    this.packingGroup.patchValue({
      capacity: trucks[0].capacity
    })
  }
}

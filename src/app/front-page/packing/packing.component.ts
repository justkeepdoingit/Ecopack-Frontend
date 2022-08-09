import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FrontPageComponent } from '../front-page.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { packingModel } from 'src/app/models/packingModel.model';
import { AppService } from 'src/app/app.service';
import { PackingDialogComponent } from './packing-dialog/packing-dialog.component';
import { FormControl } from '@angular/forms';
import { TruckDialogComponent } from './truck-dialog/truck-dialog.component';
import { VolumeDialogComponent } from './volume-dialog/volume-dialog.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { PrintDialogComponent } from './print-dialog/print-dialog.component';
import { PrintdrDialogComponent } from './printdr-dialog/printdr-dialog.component';

@Component({
  selector: 'app-packing',
  templateUrl: './packing.component.html',
  styleUrls: ['./packing.component.scss']
})
export class PackingComponent implements OnInit {


  constructor(private frontpage: FrontPageComponent, private appservice: AppService) {
    frontpage.classStatus.planner = false;
    frontpage.classStatus.dashboard = false;
    frontpage.classStatus.statusPage = false
    frontpage.classStatus.editOrders = false;
    frontpage.classStatus.lineup = false;
    frontpage.classStatus.importOrders = false
    frontpage.classStatus.converting = false
    frontpage.classStatus.fg = false
    frontpage.classStatus.delivery = false
    frontpage.classStatus.packing = true
    frontpage.classStatus.returns = false
  }
  filters = new FormControl([]);

  selectedValue: string = '';
  filter: any[] = [
    { value: 'date', viewValue: 'Date' },
    { value: 'so', viewValue: 'SO' },
    { value: 'po', viewValue: 'PO' },
    { value: 'name', viewValue: 'Name' },
    { value: 'item', viewValue: 'Item' },
    { value: 'itemdesc', viewValue: 'Item Description' },
    { value: 'qty', viewValue: 'Order Qty' },
    { value: 'deliverydate', viewValue: 'Date Needed' }
  ];

  displayedColumns: string[] = ['date', 'name', 'truck', 'capacity', 'total', 'percent', 'print'];
  newDataSource = new MatTableDataSource<packingModel>();
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) matsort: MatSort = new MatSort()

  ngOnInit(): void {
    this.appservice.getPacking(1).subscribe(data => {
      this.newDataSource.data = data;
      this.newDataSource.paginator = this.paginator
      this.newDataSource.sort = this.matsort
    })
  }
  dashboardAdmins = {
    adminClass: 'justify grid md:grid-cols-2 gap-5',
    nonAdmin: 'justify grid md:grid-cols-1 gap-5',
    useraccNA: 'flex flex-col overflow-y-auto md:flex-row md:max-w-full p-4 lg:mx-20 my-5 rounded-lg shadow-lg shadow-secondary-400',
    useraccA: 'flex flex-col md:flex-row md:max-w-full p-4 rounded-lg shadow-lg shadow-secondary-400'
  }

  centered: boolean = false;
  radius: number = 25
  unbounded: boolean = false;

  multi: boolean = false;
  dr: boolean = false;
  printed: boolean = false;

  editInfo(data: packingModel) {
    this.appservice.getTruckInfo(data).subscribe(item => {
      let dialog = this.appservice.dialog.open(EditDialogComponent, {
        data: {
          pld: item,
          pl: data
        }
      })
      dialog.afterClosed().subscribe(data => {
        if (data) {
          this.appservice.snackbar.open('List Updated!', 'Dismiss', { duration: 2500 })
          this.clearTask()
          this.clearTask()
        }
      })
    });
  }

  print(data: packingModel) {
    this.appservice.getTruckInfo(data).subscribe(item => {
      let dialog = this.appservice.dialog.open(PrintDialogComponent, {
        data: {
          pld: item,
          pl: data
        }
      })

      dialog.afterClosed().subscribe((data) => {
        if (data) {
          this.clearTask()
          this.clearTask()
          this.appservice.snackbar.open('DR Successfully Printed!', 'Dismiss', { duration: 2500 })
        }
      })
    })
  }

  addTruck() {
    let dialog = this.appservice.dialog.open(TruckDialogComponent)
    dialog.afterClosed().subscribe(data => {
      if (data == 1) {
        this.appservice.getPacking(1).subscribe(orders => {
          this.newDataSource.data = orders;
        });
        this.appservice.snackbar.open('Order Updated!', 'Dismiss', { duration: 2500 })
      }
    })
  }

  editVolume() {
    let dialog = this.appservice.dialog.open(VolumeDialogComponent)

    dialog.afterClosed().subscribe(data => {
      if (data == 1) {
        this.appservice.getPacking(1).subscribe(orders => {
          this.newDataSource.data = orders;
        });
        this.appservice.snackbar.open('Order Updated!', 'Dismiss', { duration: 2500 })
      }
    })
  }

  newPl() {
    let pl = this.appservice.dialog.open(PackingDialogComponent)
    pl.afterClosed().subscribe(data => {
      if (data) {
        this.appservice.snackbar.open('Selection Saved!', 'Dismiss', { duration: 2500 })
        this.clearTask()
        this.clearTask()
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.newDataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteRow(data: packingModel) {
    if (confirm(`Delete This Row?`)) {
      this.appservice.deletePacking(data).subscribe(data => {
        this.clearTask()
        this.clearTask()
      });
    }
  }

  printDr(data: any) {
    this.appservice.getShippingPl(data.id).subscribe(datas => {
      let dialog = this.appservice.dialog.open(PrintdrDialogComponent, {
        data: { orderlist: datas, pl: data.id }
      })

      dialog.afterClosed().subscribe(data => {
        if (data) {
          this.appservice.snackbar.open('Order Updated!', 'Dismiss', { duration: 2500 })
        }
      })
    })
  }

  showPrinted() {
    this.printed = this.printed ? false : true;
    if (this.printed) {
      this.appservice.snackbar.open('Showing List Of Printed DRs', 'Dismiss')
      this.appservice.getPacking(2).subscribe(data => {
        this.newDataSource.data = data;
        this.newDataSource.paginator = this.paginator
        this.newDataSource.sort = this.matsort
      })
    }
    else {
      this.appservice.snackbar.open('Showing List Of Unprinted DRs', 'Dismiss', { duration: 2500 })
      this.appservice.getPacking(1).subscribe(data => {
        this.newDataSource.data = data;
        this.newDataSource.paginator = this.paginator
        this.newDataSource.sort = this.matsort
      })
    }
  }

  clearTask() {
    this.appservice.getPacking(1).subscribe(data => {
      this.newDataSource.data = data;
      this.newDataSource.paginator = this.paginator
      this.newDataSource.sort = this.matsort
    })
  }
}

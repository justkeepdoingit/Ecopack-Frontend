import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { orderList } from 'src/app/models/orderList.model';
import { FrontPageComponent } from '../front-page.component';
import { StatussDialogComponent } from './status-dialog/status-dialog.component';

@Component({
  selector: 'app-status-page',
  templateUrl: './status-page.component.html',
  styleUrls: ['./status-page.component.scss']
})
export class StatusPageComponent implements OnInit {

  constructor(private frontpage: FrontPageComponent, private appservice: AppService, private datetime: DatePipe) {
    frontpage.classStatus.statusPage = true;
    frontpage.classStatus.dashboard = false;
    frontpage.classStatus.planner = false;
    frontpage.classStatus.editOrders = false;
    frontpage.classStatus.lineup = false;
    frontpage.classStatus.importOrders = false
    frontpage.classStatus.converting = false
    frontpage.classStatus.fg = false
    frontpage.classStatus.delivery = false
    frontpage.classStatus.packing = false
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
    { value: 'prodqty', viewValue: 'Prod Qty' },
    { value: 'deliverydate', viewValue: 'Date Needed' }
  ];

  displayedColumns: string[] = ['date', 'po', 'name', 'item', 'itemdesc', 'qty', 'prodqty', 'orderstatus', 'lastedited', 'deliverydate'];
  newDataSource = new MatTableDataSource<orderList>();
  filteredSource = new MatTableDataSource<orderList>();
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) matsort: MatSort = new MatSort()

  ngOnInit(): void {
    this.appservice.getAllOrders().subscribe(data => {
      this.newDataSource.data = data;
      this.newDataSource.paginator = this.paginator
      this.newDataSource.sort = this.matsort
      this.columnSearching = false;
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

  querying: boolean = false;
  //Checkbox logics

  filteredItems: string = ''

  columnSearching: boolean = false;
  forFilterValue: any[] = []

  setDatasource() {
    this.filteredSource.data = this.newDataSource.data
    this.filteredSource.paginator = this.paginator
    this.filteredSource.sort = this.matsort
  }


  forFilters: any[] = []
  filterClass: string = ``;

  checkChange(data: any) {
    if (data.length > 0) {
      this.forFilters = data;
      this.columnSearching = true
      this.setDatasource();
      this.filterClass = `md:grid-cols-${data.length} gap-1`
      for (let i = 0; i < data.length; i++) {
        this.forFilterValue[i] = '';
      }
      return
    }
    this.columnSearching = false;
    this.forFilterValue.length = 0;
    this.forFilters.length = 0;
    this.clearFilter()
    this.ngOnInit()
  }

  isOptionDisabled(opt: any): boolean {
    let filterLenght = 0;
    if (this.filters.value != null) {
      filterLenght = this.filters.value.length;
    }
    return filterLenght >= 5 && !this.filters.value!.find(el => el == opt)
  }

  clearFilter() {
    this.columnSearching = false;
    this.forFilterValue.length = 0;
    this.forFilters.length = 0;
    this.filters.setValue([]);
    this.ngOnInit()
  }

  generalFilter: boolean = true;

  applyFilter(event: Event, index: number) {

    this.forFilterValue.length = this.forFilters.length;
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    if (this.forFilters.length == 0) {
      this.newDataSource.filter = filterValue.trim().toLowerCase();
      this.filteredItems = filterValue.trim().toLowerCase()

      this.columnSearching = false;
      this.filteredSource.data = [];

      this.newDataSource.paginator = this.paginator
      this.newDataSource.sort = this.matsort

      this.selectedValue = '';

      this.generalFilter = filterValue.length == 0 ? true : false;
    }
    else if (this.forFilters.length > 0) {

      this.forFilterValue[index] = filterValue.toString();

      let filteredData: orderList[] = []
      this.newDataSource.filter = ""
      this.filteredItems = ""
      this.columnSearching = true

      this.filteredSource.paginator = this.paginator
      this.filteredSource.sort = this.matsort

      let obj: orderList;


      type ObjectKey = keyof typeof obj;
      const myVar1 = this.forFilters[0] as ObjectKey;
      const myVar2 = this.forFilters[1] as ObjectKey;
      const myVar3 = this.forFilters[2] as ObjectKey;
      const myVar4 = this.forFilters[3] as ObjectKey;
      const myVar5 = this.forFilters[4] as ObjectKey;
      filteredData = this.newDataSource.data.filter((data) => {
        if (this.forFilterValue.length == 1) {
          return data[myVar1]?.toString().trim().toLowerCase().includes(this.forFilterValue[0])
        }
        else if (this.forFilterValue.length == 2) {
          return data[myVar1]?.toString().trim().toLowerCase().includes(this.forFilterValue[0]) && data[myVar2]?.toString().trim().toLowerCase().includes(this.forFilterValue[1])
        }
        else if (this.forFilterValue.length == 3) {
          return data[myVar1]?.toString().trim().toLowerCase().includes(this.forFilterValue[0]) && data[myVar2]?.toString().trim().toLowerCase().includes(this.forFilterValue[1]) && data[myVar3]?.toString().trim().toLowerCase().includes(this.forFilterValue[2])
        }
        else if (this.forFilterValue.length == 4) {
          return data[myVar1]?.toString().trim().toLowerCase().includes(this.forFilterValue[0]) && data[myVar2]?.toString().trim().toLowerCase().includes(this.forFilterValue[1]) && data[myVar3]?.toString().trim().toLowerCase().includes(this.forFilterValue[2]) && data[myVar4]?.toString().trim().toLowerCase().includes(this.forFilterValue[3])
        }
        else {
          return data[myVar1]?.toString().trim().toLowerCase().includes(this.forFilterValue[0]) && data[myVar2]?.toString().trim().toLowerCase().includes(this.forFilterValue[1]) && data[myVar3]?.toString().trim().toLowerCase().includes(this.forFilterValue[2]) && data[myVar4]?.toString().trim().toLowerCase().includes(this.forFilterValue[3]) && data[myVar5]?.toString().trim().toLowerCase().includes(this.forFilterValue[4])
        }
      })
      this.filteredSource.data = filteredData
    }
  }

  dateTransform(data: any) {
    return this.datetime.transform(data, 'YYYY-MM-DD hh:mm:ss A')
  }

  clearTasks() {
    this.ngOnInit()
    for (let i = 0; i < this.forFilters.length; i++) {
      this.forFilterValue[i] = '';
    }
    this.clearFilter()
  }

  checkStatus(element: orderList) {
    if (!element.delivery) {
      this.appservice.dialog.open(StatussDialogComponent, {
        data: {
          order: element,
          sw: 1
        },
        width: '500px'
      })
    }
    else {
      this.appservice.getShippingReturn(element.id).subscribe(data => {
        this.appservice.dialog.open(StatussDialogComponent, {
          data: {
            order: element,
            sw: 2,
            delivery: data,
          },
          width: '500px'
        })
      })
    }
  }
}

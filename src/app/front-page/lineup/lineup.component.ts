import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { FrontPageComponent } from '../front-page.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { orderList, orderTask } from 'src/app/models/orderList.model';
import { LineupDialogComponent } from './lineup-dialog/lineup-dialog.component';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-lineup',
  templateUrl: './lineup.component.html',
  styleUrls: ['./lineup.component.scss']
})
export class LineupComponent implements OnInit {

  constructor(private appservice: AppService, private frontpage: FrontPageComponent) {
    frontpage.classStatus.statusPage = false;
    frontpage.classStatus.dashboard = false;
    frontpage.classStatus.planner = false;
    frontpage.classStatus.editOrders = false;
    frontpage.classStatus.lineup = true;
    frontpage.classStatus.importOrders = false
    frontpage.classStatus.converting = false
    frontpage.classStatus.fg = false
    frontpage.classStatus.delivery = false
    frontpage.classStatus.packing = false
  }


  displayedColumns: string[] = ['cb', 'date', 'so', 'po', 'name', 'item', 'itemdesc', 'qty', 'deliverydate', 'shipqty', 'comment'];
  newDataSource = new MatTableDataSource<orderList>();
  filteredSource = new MatTableDataSource<orderList>();
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) matsort: MatSort = new MatSort()

  ngOnInit(): void {
    this.appservice.getLineupOrders().subscribe(data => {
      this.newDataSource.data = data;
      this.newDataSource.paginator = this.paginator
      this.newDataSource.sort = this.matsort
      this.task.subtasks = data;
    })
  }

  multi: boolean = false;

  expandedElement: orderList[] = [];

  task: orderTask = {
    taskName: 'Indeterminate',
    completed: false,
    color: 'warn',
    subtasks: [],
  };

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

  editInfo(datas: orderList) {
    this.querying = true
    if (!this.multi) {
      let dialog = this.appservice.dialog.open(LineupDialogComponent, {
        data: datas,
        // width: '35%',
      })

      dialog.afterClosed().subscribe(data => {
        if (data) {
          this.clearTasks();
          this.querying = false
          return
        }
        this.querying = false;
      })
    }
    else {
      this.appservice.snackbar.open('Multiple Selection On', 'dismiss', { duration: 2500 })
    }
  }

  allComplete: boolean = false;
  items: orderList[] = []
  temporaryData: any[] = []

  setItems(data: any) {
    if (this.allComplete) {
      this.items = []
      this.temporaryData = []
    }
    else {
      this.temporaryData = [...data]
    }
  }
  //Checkbox logics
  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
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
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
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
    { value: 'deliverydate', viewValue: 'Date Needed' },
    { value: 'shipqty', viewValue: 'Machine Qty' },
  ];


  filteredItems: string = ''
  filterClass: string = '';
  columnSearching: boolean = false;
  forFilterValue: any[] = []

  setDatasource() {
    this.filteredSource.data = this.newDataSource.data
    this.filteredSource.paginator = this.paginator
    this.filteredSource.sort = this.matsort
  }

  forFilters: any[] = []
  checkChange(data: any) {
    if (data.length > 0) {
      this.forFilters = data;
      // this.multi = true
      this.columnSearching = true
      this.setDatasource();

      this.filterClass = `md:grid-cols-${data.length} gap-1`

      for (let i = 0; i < data.length; i++) {
        this.forFilterValue[i] = '';
      }
      return
    }
    // this.multi = false;
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

  applyFilter(event: Event, index: number) {
    this.forFilterValue.length = this.forFilters.length;
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();

    if (this.forFilters.length == 0) {
      this.newDataSource.filter = filterValue.trim().toLowerCase();
      this.filteredItems = filterValue.trim().toLowerCase()

      this.columnSearching = false;
      this.filteredSource.data = [];

      this.newDataSource.paginator = this.paginator
      this.newDataSource.sort = this.matsort

      this.task.subtasks = this.newDataSource.data;
      this.selectedValue = '';
    }
    else {
      this.forFilterValue[index] = filterValue.toString();

      let filteredData: orderList[] = []
      this.newDataSource.filter = ""
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
      try {
        for (let i = 0; i < this.newDataSource.data.length; i++) {
          if (this.forFilterValue.length == 1) {
            if (this.newDataSource.data[i][myVar1]?.toString().trim().includes(this.forFilterValue[0])) {
              filteredData.push(this.newDataSource.data[i])
            }
          }
          else if (this.forFilterValue.length == 2) {
            if (this.newDataSource.data[i][myVar1]?.toString().trim().includes(this.forFilterValue[0]) && this.newDataSource.data[i][myVar2]?.toString().trim().includes(this.forFilterValue[1])) {
              filteredData.push(this.newDataSource.data[i])
            }
          }
          else if (this.forFilterValue.length == 3) {
            if (this.newDataSource.data[i][myVar1]?.toString().trim().includes(this.forFilterValue[0]) && this.newDataSource.data[i][myVar2]?.toString().trim().includes(this.forFilterValue[1]) && this.newDataSource.data[i][myVar3]?.toString().trim().includes(this.forFilterValue[2])) {
              filteredData.push(this.newDataSource.data[i])
            }
          }
          else if (this.forFilterValue.length == 4) {
            if (this.newDataSource.data[i][myVar1]?.toString().trim().includes(this.forFilterValue[0]) && this.newDataSource.data[i][myVar2]?.toString().trim().includes(this.forFilterValue[1]) && this.newDataSource.data[i][myVar3]?.toString().trim().includes(this.forFilterValue[2]) && this.newDataSource.data[i][myVar4]?.toString().trim().includes(this.forFilterValue[3])) {
              filteredData.push(this.newDataSource.data[i])
            }
          }
          else if (this.forFilterValue.length == 5) {
            if (this.newDataSource.data[i][myVar1]?.toString().trim().includes(this.forFilterValue[0]) && this.newDataSource.data[i][myVar2]?.toString().trim().includes(this.forFilterValue[1]) && this.newDataSource.data[i][myVar3]?.toString().trim().includes(this.forFilterValue[2]) && this.newDataSource.data[i][myVar4]?.toString().trim().includes(this.forFilterValue[3]) && this.newDataSource.data[i][myVar5]?.toString().trim().includes(this.forFilterValue[4])) {
              filteredData.push(this.newDataSource.data[i])
            }
          }
        }
      } catch (error) {
        this.appservice.snackbar.open('The column/s you\'re trying to search is probably empty, please try other filter', 'dismiss', { duration: 2500 });
        for (let i = 0; i < this.newDataSource.data.length; i++) {
          filteredData.push(this.newDataSource.data[i])
        }
      }

      this.filteredSource.data = filteredData
      this.task.subtasks = filteredData;

    }
    if (!filterValue || this.forFilterValue.length == 0) {
      this.temporaryData = []
      this.allComplete = false
    }
  }

  setAll(completed: boolean, data: any) {
    if (this.task.subtasks == null) {
      return;
    }
    else if (!completed) {
      this.clearTasks();
      this.clearTasks()
    }
    else if (completed) {
      this.allComplete = completed
      this.task.subtasks.forEach(t => { t.completed = true })
    }

    let object: orderList[] = []

    this.task.subtasks!.forEach(t => {
      if (t.id?.toString().includes(this.filteredItems) && this.filteredItems != '') {
        t.completed = completed
        object.push(t)
        if (t.completed) {
          this.temporaryData = object;
        }
        else {
          this.temporaryData = [];
          this.task.subtasks?.forEach(t => { t.completed = false })
        }
        return
      }
      else if (t.po.includes(this.filteredItems) && this.filteredItems != '') {
        t.completed = completed
        object.push(t)
        if (t.completed) {
          this.temporaryData = object;
        }
        else {
          this.temporaryData = [];
          this.task.subtasks?.forEach(t => { t.completed = false })
        }
        return
      }
      else if (t.so.toLowerCase().includes(this.filteredItems) && this.filteredItems != '') {
        t.completed = completed
        object.push(t)
        if (t.completed) {
          this.temporaryData = object;
        }
        else {
          this.temporaryData = [];
          this.task.subtasks?.forEach(t => { t.completed = false })
        }
        return
      }
      else if (t.name.toLowerCase().includes(this.filteredItems) && this.filteredItems != '') {
        t.completed = completed
        object.push(t)
        if (t.completed) {
          this.temporaryData = object;
        }
        else {
          this.temporaryData = [];
          this.task.subtasks?.forEach(t => { t.completed = false })
        }
        return
      }
      else if (t.deliverydate?.includes(this.filteredItems) && this.filteredItems != '') {
        t.completed = completed
        object.push(t)
        if (t.completed) {
          this.temporaryData = object;
        }
        else {
          this.temporaryData = [];
          this.task.subtasks?.forEach(t => { t.completed = false })
        }
        return
      }
      else if (t.itemdesc.toString().toLowerCase().includes(this.filteredItems) && this.filteredItems != '') {
        t.completed = completed
        object.push(t)
        if (t.completed) {
          this.temporaryData = object;
        }
        else {
          this.temporaryData = [];
          this.task.subtasks?.forEach(t => { t.completed = false })
        }
        return
      }
      else if (t.item.toLowerCase().includes(this.filteredItems) && this.filteredItems != '') {
        t.completed = completed
        object.push(t)
        if (t.completed) {
          this.temporaryData = object;
        }
        else {
          this.temporaryData = [];
          this.task.subtasks?.forEach(t => { t.completed = false })
        }
        return
      }
      else if (t.date.includes(this.filteredItems) && this.filteredItems != '') {
        t.completed = completed
        object.push(t)
        if (t.completed) {
          this.temporaryData = object;
        }
        else {
          this.temporaryData = [];
          this.task.subtasks?.forEach(t => { t.completed = false })
        }
        return
      }
      else if (t.qty.toString() == this.filteredItems && this.filteredItems != '') {
        t.completed = completed
        object.push(t)
        if (t.completed) {
          this.temporaryData = object;
        }
        else {
          this.temporaryData = [];
          this.task.subtasks?.forEach(t => { t.completed = false })
        }
        return
      }
      else if (this.filteredItems == '') {
        if (!completed) {
          t.completed = false
          this.allComplete = false;
          this.temporaryData = [];
        }
        else {
          this.allComplete = completed
          t.completed = completed
        }
      }
    })
  }

  moveToFG() {
    this.querying = true;
    let newData = this.temporaryData
    let link = `https://ecopack2.herokuapp.com/order-list/fg/`
    this.appservice.movementPost(link, newData).subscribe(data => {
      this.clearTasks();
      this.clearTasks();
      this.querying = false
      this.appservice.snackbar.open('Selected Items Moved To Finished Goods', 'Dismiss', { duration: 2500 })
    })
  }

  moveToConverting() {
    this.querying = true
    let newData = this.temporaryData
    let link = `https://ecopack2.herokuapp.com/order-list/convert/`
    this.appservice.movementPost(link, newData).subscribe(data => {
      this.clearTasks();
      this.clearTasks();
      this.querying = false
      this.appservice.snackbar.open('Selected Items Moved To Converting', 'Dismiss', { duration: 2500 })
    })
  }


  clearTasks() {
    this.temporaryData.length = 0;
    this.allComplete = false
    this.task.subtasks!.forEach(t => { t.completed = false })
    this.ngOnInit()
    for (let i = 0; i < this.forFilters.length; i++) {
      this.forFilterValue[i] = '';
    }
    this.clearFilter()
  }

}

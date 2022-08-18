import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { orderList, orderTask } from 'src/app/models/orderList.model';
import { FrontPageComponent } from '../front-page.component';
import { PlannerDialogComponent } from '../planner/planner-dialog/planner-dialog.component';
import { OrderEditDialogComponent } from './order-edit-dialog/order-edit-dialog.component';

@Component({
  selector: 'app-edit-orders',
  templateUrl: './edit-orders.component.html',
  styleUrls: ['./edit-orders.component.scss']
})
export class EditOrdersComponent implements OnInit {

  constructor(private frontpage: FrontPageComponent, private appservice: AppService) {
    frontpage.classStatus.planner = false;
    frontpage.classStatus.dashboard = false;
    frontpage.classStatus.statusPage = false
    frontpage.classStatus.editOrders = true;
    frontpage.classStatus.lineup = false;
    frontpage.classStatus.importOrders = false
    frontpage.classStatus.converting = false
    frontpage.classStatus.fg = false
    frontpage.classStatus.delivery = false
    frontpage.classStatus.packing = false
    frontpage.classStatus.returns = false
  }

  filters = new FormControl([]);

  selectedValue: string = '';
  filter: any[] = [
    { value: 'date', viewValue: 'Date' },
    { value: 'po', viewValue: 'PO' },
    { value: 'name', viewValue: 'Name' },
    { value: 'item', viewValue: 'Item' },
    { value: 'itemdesc', viewValue: 'Item Description' },
    { value: 'qty', viewValue: 'Order Qty' },
  ];

  displayedColumns: string[] = ['cb', 'date', 'po', 'name', 'item', 'itemdesc', 'qty'];
  newDataSource = new MatTableDataSource<orderList>();
  filteredSource = new MatTableDataSource<orderList>();
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) matsort: MatSort = new MatSort()

  ngOnInit(): void {
    this.appservice.getAllOrders(1).subscribe(data => {
      this.newDataSource.data = data;
      this.newDataSource.paginator = this.paginator
      this.newDataSource.sort = this.matsort
      this.task.subtasks = data;
      this.columnSearching = false;
    })
  }



  multi: boolean = false;

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
    this.appservice.getShipping(datas.id).subscribe(delivery => {
      let dialog = this.appservice.dialog.open(OrderEditDialogComponent, {
        data: {
          orders: datas,
          delivery: delivery
        },
        width: '100%'
      });

      dialog.afterClosed().subscribe(dialogdata => {
        if (dialogdata) {
          this.appservice.snackbar.open(`Order Updated For PO# ${datas.po}`, 'Dismiss', { duration: 2500 })
          this.clearTasks()
          this.clearTasks()
        }
      })
    })
  }

  allComplete: boolean = false;
  items: orderList[] = []
  temporaryData: any[] = []

  setItems(data: any) {
    if (this.allComplete) {
      this.items = []
      this.temporaryData.length = 0
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
    this.temporaryData.length = 0;
    this.allComplete = false
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

      this.task.subtasks = this.newDataSource.data;
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
      this.task.subtasks = filteredData;

      if (this.temporaryData.length == this.filteredSource.filteredData.length) {
        this.allComplete = true
      }
      else {
        this.allComplete = false
      }
    }
    else {
      if (this.temporaryData.length == this.newDataSource.filteredData.length) {
        this.allComplete = true
      }
      else {
        this.allComplete = false
      }
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
          this.temporaryData.length = 0;
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
          this.temporaryData.length = 0;
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
          this.temporaryData.length = 0;
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
          this.temporaryData.length = 0;
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
          this.temporaryData.length = 0;
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
          this.temporaryData.length = 0;
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
          this.temporaryData.length = 0;
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
          this.temporaryData.length = 0;
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
          this.temporaryData.length = 0;
          this.task.subtasks?.forEach(t => { t.completed = false })
        }
        return
      }
      else if (this.filteredItems == '') {
        if (!completed) {
          t.completed = false
          this.allComplete = false;
          this.temporaryData.length = 0;
        }
        else {
          this.allComplete = completed
          t.completed = completed
        }
      }
    })
  }

  deleteData() {
    let newData = this.temporaryData
    if (confirm("Delete This Order?")) {
      this.appservice.deleteData(newData).subscribe(() => {
        this.appservice.snackbar.open('Order Deleted', 'Dismiss', { duration: 2500 })
        this.clearTasks()
        this.clearTasks()
      });
    }
  }

  downloadLink = '';
  downloads: boolean = false;
  exportData() {
    this.appservice.exportData().subscribe(data => {
      this.downloadLink = `../../../assets/${data[0]}`
      this.downloads = true
      this.appservice.snackbar.open('Export Successful Click Download Button to Download', 'Dismiss', { duration: 3500 })
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

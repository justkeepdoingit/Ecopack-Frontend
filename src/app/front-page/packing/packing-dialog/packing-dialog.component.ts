import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { packingModel } from 'src/app/models/packingModel.model';
import { truckModel, truckSelect } from 'src/app/models/truckModel.model';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { pickingModel, pickingTask } from 'src/app/models/pickingModel.model';
import { PackingInnerDialogComponent } from './packing-inner-dialog/packing-inner-dialog.component';
@Component({
  selector: 'app-packing-dialog',
  templateUrl: './packing-dialog.component.html',
  styleUrls: ['./packing-dialog.component.scss']
})
export class PackingDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private packing: packingModel, private appservice: AppService,
    private dialogRef: MatDialogRef<PackingDialogComponent>, public datepipe: DatePipe) { }

  packingGroup = new FormGroup({})
  minDate = new Date()

  refreshData() {
    this.appservice.getPicking(1).subscribe(data => {
      this.newDataSource.data = data;
      this.newDataSource.paginator = this.paginator
      this.newDataSource.sort = this.matsort
      this.task.subtasks = data;
      this.columnSearching = false;
    })
  }

  ngOnInit(): void {
    this.refreshData()
    this.packingGroup = this.appservice.formBuilder.group({
      date: [this.datepipe.transform(new Date(), 'yyyy-MM-dd'), Validators.required],
      truck: ['', Validators.required],
      capacity: [''],
      total: [''],
      percent: ['']
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

  enableEdit = false;
  enableEditIndex = null;
  editValue = '';

  editVolume(data: any) {
    this.editValue = data.volume;
    this.enableEdit = true;
    this.enableEditIndex = data;
  }
  saveVolume(data: any) {
    this.enableEdit = false;
    this.enableEditIndex = null;

    let updateData = {
      itemid: data.item,
      volume: this.editValue
    }

    this.appservice.updateVolume(updateData).subscribe(() => {
      this.appservice.getPicking(1).subscribe(data => {
        this.newDataSource.data = data;
        this.newDataSource.paginator = this.paginator
        this.newDataSource.sort = this.matsort
      })
      this.appservice.snackbar.open('Data Updated', 'Dismiss', { duration: 2500 })
    })
  }

  truckSelect(datas: any) {
    let trucks = this.truckInfos.filter(data => {
      return data.id == datas;
    })

    this.packingGroup.patchValue({
      capacity: trucks[0].capacity
    })
  }

  deliverItems() {
    let dialog = this.appservice.dialog.open(PackingInnerDialogComponent, {
      data: this.temporaryData
    })

    dialog.afterClosed().subscribe(data => {
      if (data) {
        this.dialogRef.close(1);
      }
    })
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
    { value: 'pendingqty', viewValue: 'Pending Qty' },
  ];

  displayedColumns: string[] = ['cb', 'date', 'po', 'name', 'item', 'itemdesc', 'qty', 'pendingqty', 'volume', 'volumet'];
  newDataSource = new MatTableDataSource<pickingModel>();
  filteredSource = new MatTableDataSource<pickingModel>();
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) matsort: MatSort = new MatSort()


  multi: boolean = true;

  expandedElement: pickingModel[] = [];

  task: pickingTask = {
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
  bypass: boolean = false;

  allComplete: boolean = false;
  items: pickingModel[] = []
  temporaryData: any[] = []

  setItems(data: any) {
    if (this.allComplete) {
      this.items = []
      this.temporaryData = []
    }
    else {
      this.temporaryData = [...data]
    }
    console.log(this.temporaryData.length)
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

  filterClass: string = '';

  forFilters: any[] = []
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
    this.refreshData()
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
    this.refreshData()
  }

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
    }
    else {
      this.forFilterValue[index] = filterValue.toString();

      let filteredData: pickingModel[] = []
      this.newDataSource.filter = ""
      this.columnSearching = true

      this.filteredSource.paginator = this.paginator
      this.filteredSource.sort = this.matsort

      let obj: pickingModel;


      type ObjectKey = keyof typeof obj;
      const myVar1 = this.forFilters[0] as ObjectKey;
      const myVar2 = this.forFilters[1] as ObjectKey;
      const myVar3 = this.forFilters[2] as ObjectKey;
      const myVar4 = this.forFilters[3] as ObjectKey;
      const myVar5 = this.forFilters[4] as ObjectKey;
      for (let i = 0; i < this.newDataSource.data.length; i++) {
        if (this.forFilterValue.length == 1) {
          if (this.newDataSource.data[i][myVar1]?.toString().trim().toLowerCase().includes(this.forFilterValue[0])) {
            filteredData.push(this.newDataSource.data[i])
          }
        }
        else if (this.forFilterValue.length == 2) {
          if (this.newDataSource.data[i][myVar1]?.toString().trim().toLowerCase().includes(this.forFilterValue[0]) && this.newDataSource.data[i][myVar2]?.toString().trim().toLowerCase().includes(this.forFilterValue[1])) {
            filteredData.push(this.newDataSource.data[i])
          }
        }
        else if (this.forFilterValue.length == 3) {
          if (this.newDataSource.data[i][myVar1]?.toString().trim().toLowerCase().includes(this.forFilterValue[0]) && this.newDataSource.data[i][myVar2]?.toString().trim().toLowerCase().includes(this.forFilterValue[1]) && this.newDataSource.data[i][myVar3]?.toString().trim().toLowerCase().includes(this.forFilterValue[2])) {
            filteredData.push(this.newDataSource.data[i])
          }
        }
        else if (this.forFilterValue.length == 4) {
          if (this.newDataSource.data[i][myVar1]?.toString().trim().toLowerCase().includes(this.forFilterValue[0]) && this.newDataSource.data[i][myVar2]?.toString().trim().toLowerCase().includes(this.forFilterValue[1]) && this.newDataSource.data[i][myVar3]?.toString().trim().toLowerCase().includes(this.forFilterValue[2]) && this.newDataSource.data[i][myVar4]?.toString().trim().toLowerCase().includes(this.forFilterValue[3])) {
            filteredData.push(this.newDataSource.data[i])
          }
        }
        else if (this.forFilterValue.length == 5) {
          if (this.newDataSource.data[i][myVar1]?.toString().trim().toLowerCase().includes(this.forFilterValue[0]) && this.newDataSource.data[i][myVar2]?.toString().trim().toLowerCase().includes(this.forFilterValue[1]) && this.newDataSource.data[i][myVar3]?.toString().trim().toLowerCase().includes(this.forFilterValue[2]) && this.newDataSource.data[i][myVar4]?.toString().trim().toLowerCase().includes(this.forFilterValue[3]) && this.newDataSource.data[i][myVar5]?.toString().trim().toLowerCase().includes(this.forFilterValue[4])) {
            filteredData.push(this.newDataSource.data[i])
          }
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
      this.temporaryData.length = 0;
      this.task.subtasks!.forEach(t => { t.completed = false })
    }
    else if (completed) {
      this.allComplete = completed
      this.task.subtasks.forEach(t => { t.completed = true })
    }

    let object: pickingModel[] = []

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


  bypassList(sw: number) {
    this.bypass = this.bypass ? false : true;
    this.temporaryData.length = 0;
    for (let i = 0; i < this.forFilters.length; i++) {
      this.forFilterValue[i] = '';
    }
    this.task.subtasks!.forEach(t => { t.completed = false })

    this.appservice.getPicking(sw).subscribe(data => {
      console.log(data);
      this.newDataSource.data = data;
      this.newDataSource.paginator = this.paginator
      this.newDataSource.sort = this.matsort
      this.task.subtasks = data;
      this.columnSearching = false;
    })
  }

  clearTasks() {
    this.temporaryData.length = 0;
    this.allComplete = false
    this.task.subtasks!.forEach(t => { t.completed = false })
    this.refreshData()
    for (let i = 0; i < this.forFilters.length; i++) {
      this.forFilterValue[i] = '';
    }
    this.clearFilter()
  }
}


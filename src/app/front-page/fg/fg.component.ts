import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FrontPageComponent } from '../front-page.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { orderList, orderTask } from 'src/app/models/orderList.model';
import { AppService } from 'src/app/app.service';
import { FgDialogComponent } from './fg-dialog/fg-dialog.component';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-fg',
  templateUrl: './fg.component.html',
  styleUrls: ['./fg.component.scss']
})
export class FgComponent implements OnInit {

  constructor(private frontpage: FrontPageComponent, private appservice: AppService) {
    frontpage.classStatus.planner = false;
    frontpage.classStatus.dashboard = false;
    frontpage.classStatus.statusPage = false
    frontpage.classStatus.editOrders = false;  
    frontpage.classStatus.lineup = false;
    frontpage.classStatus.importOrders = false
    frontpage.classStatus.converting = false
    frontpage.classStatus.fg = true

  }
  filters = new FormControl([]);

  selectedValue:string = '';
  filter: any[] = [
    {value: 'date', viewValue: 'Date'},
    {value: 'so', viewValue: 'SO'},
    {value: 'po', viewValue: 'PO'},
    {value: 'name', viewValue: 'Name'},
    {value: 'item', viewValue: 'Item'},
    {value: 'itemdesc', viewValue: 'Item Description'},
    {value: 'qty', viewValue: 'Order Qty'},
    {value: 'deliverydate', viewValue: 'Date Needed'}
  ];

  displayedColumns: string[] = ['cb','date','so', 'po', 'name', 'item','itemdesc','qty', 'deliverydate', 'comment'];
  newDataSource = new MatTableDataSource<orderList>();
  filteredSource = new MatTableDataSource<orderList>();
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) matsort: MatSort = new MatSort()

  ngOnInit(): void {
    localStorage.clear()
    this.appservice.getFgOrders().subscribe(data=>{
      this.newDataSource.data = data;
      this.newDataSource.paginator = this.paginator
      this.newDataSource.sort = this.matsort
      this.task.subtasks = data;
      this.columnSearching = false;
      console.log(data);
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
    adminClass: 'justify grid lg:grid-cols-2 gap-5',
    nonAdmin: 'justify grid lg:grid-cols-1 gap-5',
    useraccNA: 'flex flex-col overflow-y-auto md:flex-row md:max-w-full p-4 lg:mx-20 my-5 rounded-lg shadow-lg shadow-secondary-400',
    useraccA: 'flex flex-col md:flex-row md:max-w-full p-4 rounded-lg shadow-lg shadow-secondary-400'
  }

  centered: boolean = false;
  radius: number = 25
  unbounded: boolean = false;

  editInfo(datas: orderList){
    if(!this.multi){
      let dialog = this.appservice.dialog.open(FgDialogComponent, {
        data: [datas]
      })
  
      dialog.afterClosed().subscribe(data=>{
        if(data == 1){
          this.appservice.getFgOrders().subscribe(orders=>{
            if(!this.columnSearching){
              this.newDataSource.data = orders;
              this.task.subtasks = orders
              this.clearTasks();
            }
            else{
              this.filteredSource.data = orders;
              this.task.subtasks = orders
              this.clearTask2();
            }
          });
          this.appservice.snackbar.open('Order Updated!', 'dismiss',{duration:2500})
        }
        
      })
    }
    else{
      this.appservice.snackbar.open('Multiple Selection On', 'dismiss',{duration:2500})
    }
  }

  allComplete: boolean = false;
  items: orderList[] = []
  temporaryData: orderList[] = []

  setItems(data: any){
    if(this.allComplete){
       this.items = []
       this.temporaryData = []
    }
    else{
      this.items = data
      localStorage.setItem("temporaryData", JSON.stringify(data))
      this.temporaryData = JSON.parse(localStorage.getItem('temporaryData') || '{}')
    }
  }

  //Checkbox logics
  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
  }
  checkboxChecked(checked: boolean, data: orderList){
    if(checked && !this.allComplete && this.temporaryData == []){
     this.temporaryData.push(data)
     localStorage.setItem("temporaryData", JSON.stringify(this.temporaryData))
     this.temporaryData = JSON.parse(localStorage.getItem("temporaryData") || '{}')
    }
    else if(this.allComplete){
      this.temporaryData.push(data)
      localStorage.removeItem("temporaryData")
      localStorage.setItem("allItems", JSON.stringify(this.temporaryData))
      localStorage.setItem("temporaryData", JSON.stringify(this.temporaryData))
      this.temporaryData = JSON.parse(localStorage.getItem("temporaryData") || '{}')
    }
    else if(!checked && !this.allComplete){
      localStorage.removeItem("allItems")
      let localItem = JSON.parse(localStorage.getItem("temporaryData")!)
      for(let i = 0; i < localItem.length; i++){
        if(data.id == localItem[i].id){
          this.temporaryData.splice(i, 1)
          localStorage.setItem("temporaryData", JSON.stringify(this.temporaryData))
          break
        }
      }
    }
    else{
      this.temporaryData.push(data)
      localStorage.setItem("temporaryData", JSON.stringify(this.temporaryData))
      this.temporaryData = JSON.parse(localStorage.getItem("temporaryData") || '{}')
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
  
  setDatasource(){
    this.filteredSource.data = this.newDataSource.data
    this.filteredSource.paginator = this.paginator
    this.filteredSource.sort = this.matsort
  }

  filterClass: string = '';

  forFilters: any[] = []
  checkChange(data:any){
    if(data.length > 0){
      this.forFilters = data;
      // this.multi = true
      this.columnSearching = true
      this.setDatasource();

      this.filterClass = `justify grid lg:grid-cols-${this.forFilters.length} gap-1`

      for(let i = 0; i < data.length; i++){
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
    if(this.filters.value != null){
      filterLenght = this.filters.value.length;
    }
    return filterLenght >= 5 && !this.filters.value!.find(el => el == opt)
  }

  clearFilter(){
    this.columnSearching = false;
    this.forFilterValue.length = 0;
    this.forFilters.length = 0;
    this.filters.setValue([]);
    this.ngOnInit()
  }
  
  applyFilter(event: Event, index:number) {

    this.forFilterValue.length = this.forFilters.length;
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    if(this.forFilters.length == 0){
     this.newDataSource.filter = filterValue.trim().toLowerCase();
     this.filteredItems = filterValue.trim().toLowerCase()

     this.columnSearching = false;
     this.filteredSource.data = [];
     
     this.newDataSource.paginator = this.paginator
     this.newDataSource.sort = this.matsort

     this.task.subtasks = this.newDataSource.data;
     this.selectedValue = '';
    }
    else{
      this.forFilterValue[index] = filterValue.toString();

      let filteredData:orderList[] = []
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
      for(let i = 0;i < this.newDataSource.data.length; i++){
        if(this.forFilterValue.length == 1){
          if(this.newDataSource.data[i][myVar1]?.toString().trim().toLowerCase().includes(this.forFilterValue[0])){
            filteredData.push(this.newDataSource.data[i])
          }
        }
        else if(this.forFilterValue.length == 2){
          if(this.newDataSource.data[i][myVar1]?.toString().trim().toLowerCase().includes(this.forFilterValue[0]) && this.newDataSource.data[i][myVar2]?.toString().trim().toLowerCase().includes(this.forFilterValue[1])){
            filteredData.push(this.newDataSource.data[i])
          }
        }
        else if(this.forFilterValue.length == 3){
          if(this.newDataSource.data[i][myVar1]?.toString().trim().toLowerCase().includes(this.forFilterValue[0]) && this.newDataSource.data[i][myVar2]?.toString().trim().toLowerCase().includes(this.forFilterValue[1]) && this.newDataSource.data[i][myVar3]?.toString().trim().toLowerCase().includes(this.forFilterValue[2])){
            filteredData.push(this.newDataSource.data[i])
          }
        }
        else if(this.forFilterValue.length == 4){
          if(this.newDataSource.data[i][myVar1]?.toString().trim().toLowerCase().includes(this.forFilterValue[0]) && this.newDataSource.data[i][myVar2]?.toString().trim().toLowerCase().includes(this.forFilterValue[1]) && this.newDataSource.data[i][myVar3]?.toString().trim().toLowerCase().includes(this.forFilterValue[2]) && this.newDataSource.data[i][myVar4]?.toString().trim().toLowerCase().includes(this.forFilterValue[3])){
            filteredData.push(this.newDataSource.data[i])
          }
        }
        else if(this.forFilterValue.length == 5){
          if(this.newDataSource.data[i][myVar1]?.toString().trim().toLowerCase().includes(this.forFilterValue[0]) && this.newDataSource.data[i][myVar2]?.toString().trim().toLowerCase().includes(this.forFilterValue[1]) && this.newDataSource.data[i][myVar3]?.toString().trim().toLowerCase().includes(this.forFilterValue[2]) && this.newDataSource.data[i][myVar4]?.toString().trim().toLowerCase().includes(this.forFilterValue[3]) && this.newDataSource.data[i][myVar5]?.toString().trim().toLowerCase().includes(this.forFilterValue[4])){
            filteredData.push(this.newDataSource.data[i])
          }
        }
      }

      this.filteredSource.data = filteredData
      this.task.subtasks = filteredData;

    }
    if(!filterValue || this.forFilterValue.length == 0){
      localStorage.removeItem("allItems")
      this.allComplete = false
    }
  }

  setAll(completed: boolean, data: any) {
    if (this.task.subtasks == null) {
      return;
    }
    else if(!completed){
          localStorage.clear()
    }
    else if(completed){
      this.allComplete = completed
      this.task.subtasks.forEach(t=>{t.completed = false})
    }

    let object: orderList[] = []

    this.task.subtasks.forEach(t => {
      if(t.id?.toString().includes(this.filteredItems) && this.filteredItems != ''){
        t.completed = completed
        object.push(t)
        if(t.completed){
          localStorage.setItem("allItems", JSON.stringify(object))
          localStorage.setItem("temporaryData", JSON.stringify(object))
          
          this.temporaryData = JSON.parse(localStorage.getItem('temporaryData') || '{}')
        }
        else{
          
          localStorage.clear()
          this.task.subtasks?.forEach(t=>{t.completed = false})
        }
        return
      }
      else if(t.po.includes(this.filteredItems) && this.filteredItems != ''){
        t.completed = completed
        object.push(t)
        if(t.completed){
          localStorage.setItem("allItems", JSON.stringify(object))
          localStorage.setItem("temporaryData", JSON.stringify(object))
          
          this.temporaryData = JSON.parse(localStorage.getItem('temporaryData') || '{}')
        }
        else{
          
          localStorage.clear()
          this.task.subtasks?.forEach(t=>{t.completed = false})
        }
        return
      }
      else if(t.so.toLowerCase().includes(this.filteredItems) && this.filteredItems != ''){
        t.completed = completed
        object.push(t)
        if(t.completed){
          localStorage.setItem("allItems", JSON.stringify(object))
          localStorage.setItem("temporaryData", JSON.stringify(object))

          this.temporaryData = JSON.parse(localStorage.getItem('temporaryData') || '{}')
        }
        else{
          
          localStorage.clear()
          this.task.subtasks?.forEach(t=>{t.completed = false})
        }
        return
      }
      else if(t.name.toLowerCase().includes(this.filteredItems) && this.filteredItems != ''){
        t.completed = completed
        object.push(t)
        if(t.completed){
          localStorage.setItem("allItems", JSON.stringify(object))
          localStorage.setItem("temporaryData", JSON.stringify(object))

          this.temporaryData = JSON.parse(localStorage.getItem('temporaryData') || '{}')
        }
        else{
          
          localStorage.clear()
        }
        return
      }
      else if(t.deliverydate?.includes(this.filteredItems) && this.filteredItems != ''){
        t.completed = completed
        object.push(t)
        if(t.completed){
          localStorage.setItem("allItems", JSON.stringify(object))
          localStorage.setItem("temporaryData", JSON.stringify(object))

          this.temporaryData = JSON.parse(localStorage.getItem('temporaryData') || '{}')
        }
        else{
          
          localStorage.clear()
        }
        return
      }
      else if(t.itemdesc.toString().toLowerCase().includes(this.filteredItems) && this.filteredItems != ''){
        t.completed = completed
        object.push(t)
        if(t.completed){
          localStorage.setItem("allItems", JSON.stringify(object))
          localStorage.setItem("temporaryData", JSON.stringify(object))
          this.temporaryData = JSON.parse(localStorage.getItem('temporaryData') || '{}')
        }
        else{
          
          localStorage.clear()
        }
        return
      }
      else if(t.item.toLowerCase().includes(this.filteredItems) && this.filteredItems != ''){
        t.completed = completed
        object.push(t)
        if(t.completed){
          localStorage.setItem("allItems", JSON.stringify(object))
          localStorage.setItem("temporaryData", JSON.stringify(object))

          this.temporaryData = JSON.parse(localStorage.getItem('temporaryData') || '{}')
        }
        else{
          
          localStorage.clear()
        }
        return
      }
      else if(t.date.includes(this.filteredItems) && this.filteredItems != ''){
        t.completed = completed
        object.push(t)
        if(t.completed){
          localStorage.setItem("allItems", JSON.stringify(object))
          localStorage.setItem("temporaryData", JSON.stringify(object))
          this.temporaryData = JSON.parse(localStorage.getItem('temporaryData') || '{}')
        }
        else{
          
          localStorage.clear()
        }
        return
      }
      else if(t.qty.toString() == this.filteredItems && this.filteredItems != ''){
        t.completed = completed
        object.push(t)
        if(t.completed){
          localStorage.setItem("allItems", JSON.stringify(object))
          localStorage.setItem("temporaryData", JSON.stringify(object))
          this.temporaryData = JSON.parse(localStorage.getItem('temporaryData') || '{}')
        }
        else{
          
          localStorage.clear()
        }
        return
      }
      else if(this.filteredItems == ''){
        if(!completed){
          t.completed = false
          this.allComplete = false;
          localStorage.clear()
          
        }
        else{
          this.allComplete = completed
          t.completed = completed
          localStorage.setItem("allItems", JSON.stringify(data))
        }
      }
    })
  }

    clearTask2(){
      localStorage.clear()
      this.temporaryData.length = 0;
      this.allComplete = false
      this.task.subtasks!.forEach(t=>{t.completed = false})
      for(let i = 0; i < this.forFilters.length; i++){
        this.forFilterValue[i] = '';
      }
      this.clearFilter()
    }

  updateMultiple(){
    let newData = JSON.parse(localStorage.getItem('temporaryData') || "{}")
      let dialog = this.appservice.dialog.open(FgDialogComponent, {
        data: newData
      })

      dialog.afterClosed().subscribe(data=>{
        if(data){
          this.appservice.getFgOrders().subscribe(orders=>{
            if(!this.columnSearching){
              this.newDataSource.data = orders;
              this.task.subtasks = orders;
              this.clearTasks();
            }
            else{
              this.filteredSource.data = orders;
              this.task.subtasks = orders
              this.clearTask2();
            }
          })
        }
        
      })
    }

    moveToDelivery(){
      let newData = JSON.parse(localStorage.getItem('temporaryData') || "{}")
      let link = `http://localhost:3000/order-list/delivery/`
      this.appservice.movementPost(link, newData).subscribe(data=>{
        this.appservice.getFgOrders().subscribe(orders=>{
          if(!this.columnSearching){
            this.newDataSource.data = orders;
            this.task.subtasks = orders;
            this.clearTasks();
          }
          else{
            this.filteredSource.data = orders;
            this.task.subtasks = orders
            this.clearTask2();
          }
          this.appservice.snackbar.open("Selected items moved to Delivery", "Dismiss", {duration: 2500})
        })
      })
    }


    clearTasks(){
      this.temporaryData.length = 0;
      localStorage.clear()
      this.allComplete = false
      this.task.subtasks!.forEach(t=>{t.completed = false})
    }
}

import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { FrontPageComponent } from '../front-page.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { orderList, orderTask } from 'src/app/models/orderList.model';
import { LineupDialogComponent } from './lineup-dialog/lineup-dialog.component';
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

   }

  
  displayedColumns: string[] = ['cb','date','so', 'po', 'name', 'item','itemdesc','qty', 'deliverydate', 'shipqty', 'comment'];
  newDataSource = new MatTableDataSource<orderList>();
  filteredSource = new MatTableDataSource<orderList>();
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) matsort: MatSort = new MatSort()

  ngOnInit(): void {
    localStorage.clear()
    this.appservice.getLineupOrders().subscribe(data=>{
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
    adminClass: 'justify grid lg:grid-cols-2 gap-5',
    nonAdmin: 'justify grid lg:grid-cols-1 gap-5',
    useraccNA: 'flex flex-col overflow-y-auto md:flex-row md:max-w-full p-4 lg:mx-20 my-5 rounded-lg shadow-lg shadow-secondary-400',
    useraccA: 'flex flex-col md:flex-row md:max-w-full p-4 rounded-lg shadow-lg shadow-secondary-400'
  }

  centered: boolean = false;
  radius: number = 25
  unbounded: boolean = false;

  editInfo(data: orderList){
    if(!this.multi){
      let dialog = this.appservice.dialog.open(LineupDialogComponent, {
        data: data,
        // width: '35%',
      })
  
      dialog.afterClosed().subscribe(data=>{
        this.appservice.getLineupOrders().subscribe(orders=>{
          this.newDataSource.data = orders;
          this.task.subtasks = orders
          this.clearTasks();
        });
        
      })
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLocaleLowerCase();

    let columnSearch = filterValue.split(':');

    if(columnSearch.length == 1){
     this.newDataSource.filter = filterValue.trim().toLowerCase();
     this.filteredItems = filterValue.trim().toLowerCase()
     
     this.columnSearching = false;
     this.filteredSource.data = [];

     this.newDataSource.paginator = this.paginator
     this.newDataSource.sort = this.matsort

     this.task.subtasks = this.newDataSource.data;
    }

    else{
     let filteredData:orderList[] = []
     let columsearch = columnSearch[1].toLowerCase()
     this.newDataSource.filter = ""
     this.columnSearching = true

     this.filteredSource.paginator = this.paginator
     this.filteredSource.sort = this.matsort

     this.filteredItems = columnSearch[1];


     
     for(let i = 0;i < this.newDataSource.data.length; i++){
       if(columnSearch[0].includes("so")){
         if(this.newDataSource.data[i].so.toString().trim().includes(columsearch)){
           filteredData.push(this.newDataSource.data[i])
         }
       }
       if(columnSearch[0].includes("po")){
         if(this.newDataSource.data[i].po.toString().trim().includes(columsearch)){
           filteredData.push(this.newDataSource.data[i])
         }
       }
       if(columnSearch[0].includes("name")){
         if(this.newDataSource.data[i].name.trim().toLowerCase().includes(columsearch)){
           filteredData.push(this.newDataSource.data[i])
         }
       }
       if(columnSearch[0] == "item"){
         if(this.newDataSource.data[i].item.trim().toLowerCase().includes(columsearch)){
           filteredData.push(this.newDataSource.data[i])
         }
       }
       if(columnSearch[0].includes("desc")){
         if(this.newDataSource.data[i].itemdesc.trim().toLowerCase().includes(columsearch)){
           filteredData.push(this.newDataSource.data[i])
         }
       }
       if(columnSearch[0].includes("qty")){
         if(this.newDataSource.data[i].qty.toString().trim().includes(columsearch)){
           filteredData.push(this.newDataSource.data[i])
         }
       }
       if(columnSearch[0].includes("prod")){
         if(this.newDataSource.data[i].shipqty?.toString().trim().includes(columsearch)){
           filteredData.push(this.newDataSource.data[i])
         }
       }
     }
     this.filteredSource.data = filteredData
     this.task.subtasks = filteredData;
     }

     if(!filterValue || !columnSearch[1]){
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
      else if(t.date.toString().includes(this.filteredItems) && this.filteredItems != ''){
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

    moveToFG(){
      let newData = JSON.parse(localStorage.getItem('temporaryData') || "{}")
      let link = `https://ecopack2.herokuapp.com/order-list/fg/`
      this.appservice.movementPost(link, newData).subscribe(data=>{
        this.appservice.getLineupOrders().subscribe(orders=>{
          this.newDataSource.data = orders;
          this.filteredSource.data = orders;
          this.task.subtasks = orders;
          this.clearTasks();
          this.appservice.snackbar.open("Selected items moved to Finished Good", "Dismiss", {duration: 2500})
        })
      })
    }

    moveToConverting(){
      let newData = JSON.parse(localStorage.getItem('temporaryData') || "{}")
      let link = `https://ecopack2.herokuapp.com/order-list/convert/`
      this.appservice.movementPost(link, newData).subscribe(data=>{
        this.appservice.getLineupOrders().subscribe(orders=>{
          this.newDataSource.data = orders;
          this.filteredSource.data = orders;
          this.task.subtasks = orders;
          this.clearTasks();
          this.appservice.snackbar.open("Selected items moved to Converting", "Dismiss", {duration: 2500})
        })
      })
    }


    clearTasks(){
      this.temporaryData.length = 0;
      localStorage.clear()
      this.allComplete = false
      this.task.subtasks!.forEach(t=>{t.completed = false})
      this.ngOnInit()
    }

}

import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FrontPageComponent } from '../front-page.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { orderList, orderTask } from 'src/app/models/orderList.model';
import { AppService } from 'src/app/app.service';
import { PlannerDialogComponent } from './planner-dialog/planner-dialog.component';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit, OnDestroy {

  constructor(private frontpage: FrontPageComponent, private appservice: AppService) {
    frontpage.classStatus.planner = true;
    frontpage.classStatus.dashboard = false;
    frontpage.classStatus.statusPage = false
    frontpage.classStatus.editOrders = false;  
    frontpage.classStatus.lineup = false;
    frontpage.classStatus.importOrders = false
    frontpage.classStatus.converting = false
    frontpage.classStatus.fg = false

  }


  @ViewChild(DataTableDirective, {static: false})
  datatableElement!: DataTableDirective;

  dtTrigger: Subject<any> = new Subject<any>();

  dtOptions: DataTables.Settings = {}
  orderList: orderList[] = []
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.appservice.getPlannerOrders().subscribe(data=>{
      this.orderList = data;
      this.dtTrigger.next(1);
    })
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }


}
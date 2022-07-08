import { Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FrontPageComponent } from '../front-page/front-page.component';
import { userModel } from '../models/usermodels.model';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { AppService } from '../app.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './user-dialog/user-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private frontpage: FrontPageComponent, private appservice: AppService, private dialog: MatDialog) { 
    frontpage.classStatus.dashboard = true;
    frontpage.classStatus.statusPage = false;
    frontpage.classStatus.planner = false;
    frontpage.classStatus.editOrders = false
    frontpage.classStatus.lineup = false
    frontpage.classStatus.importOrders = false
    frontpage.classStatus.converting = false
    this.admin = this.appservice.cookieService.get('user_rights')
  }
  admin: string = '';
  centered: boolean = false;
  radius: number = 25;
  displayedColumns: string[] = ['id','username','user_rights'];
  newDataSource = new MatTableDataSource<userModel>();

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) matsort: MatSort = new MatSort()


  ngOnInit(): void {
    this.appservice.getAllUsers().subscribe(data=>{
      this.newDataSource.data = data;
      this.newDataSource.paginator = this.paginator
      this.newDataSource.sort = this.matsort
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.newDataSource.filter = filterValue.trim().toLowerCase();
  }

  dashboardAdmins = {
    adminClass: 'justify grid lg:grid-cols-2 gap-5',
    nonAdmin: 'justify grid lg:grid-cols-1 gap-5',
    useraccNA: 'flex flex-col md:flex-row md:max-w-full p-4 lg:mx-44 rounded-lg shadow-lg shadow-secondary-400',
    useraccA: 'flex flex-col md:flex-row md:max-w-full p-4 rounded-lg shadow-lg shadow-secondary-400'
  }
  

  getInfos(data: userModel){
    let dialogOpen = this.dialog.open(UserDialogComponent, {
      data: data
    })
    dialogOpen.afterClosed().subscribe(data=>{
      if(data){
        this.appservice.snackbar.open("User Info Saved", "Dismiss",{duration:1500})
        this.appservice.getAllUsers().subscribe(data=>{
          this.newDataSource.data = data;
          this.newDataSource.paginator = this.paginator
          this.newDataSource.sort = this.matsort
        })
      }
    })
  }


}

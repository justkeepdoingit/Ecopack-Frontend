import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { userModel } from './models/usermodels.model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { FrontPageComponent } from './front-page/front-page.component';
import { orderList } from './models/orderList.model';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(public http: HttpClient, public formBuilder: FormBuilder, public snackbar: MatSnackBar, public cookieService: CookieService,
      public router: Router, public dialog: MatDialog
    ) { 
  } 

  userInfos!: userModel;

  getPlannerOrders(): Observable<orderList[]>{
    return this.http.get<orderList[]>('api/order-list/planners')
  }

  getLineupOrders(): Observable<orderList[]>{
    return this.http.get<orderList[]>('api/order-list/lineupOrders')
  }

  getAllUsers(): Observable<userModel[]>{
    return this.http.get<userModel[]>('api/user-account/getAllUsers')
  }

  getInfo(id: number): Observable<userModel>{
    return this.http.get<userModel>(`api/user-account/findUser/${id}`, {withCredentials:true})
  }

  updateUsers(datas: userModel){
    let rights: number;
    if(datas.username != "admin" && datas.planner && datas.converting && datas.delivery && datas.edit_orders && datas.lineup && datas.fg && datas.returns && datas.status_page && datas.import_orders && datas.useracc){
      rights = 1
    }
    else if(datas.username == "admin"){
      rights = 1;
    }
    else{
      rights = 2
    }
    this.http.patch<userModel>(`api/user-account/updateUsers/${datas.id}`,{
      id: datas.id,
      username: datas.username,
      password: datas.password,
      firstname: datas.firstname,
      lastname: datas.lastname,
      user_rights: rights,
      planner: datas.planner,
      converting: datas.converting,
      delivery: datas.delivery,
      edit_orders: datas.edit_orders,
      lineup: datas.lineup,
      fg: datas.fg,
      returns: datas.returns,
      status_page: datas.status_page,
      import_orders: datas.import_orders,
      useracc: datas.useracc,
      contact: datas.contact,
      email: datas.email
    }).subscribe()
  }

  logreg(username: string, password: string, status: number){
    if(status == 2){
      this.http.post<userModel>('api/user-account/register',{
        username: username,
        password: password
      }).subscribe(data=>{
        this.snackbar.open("Account registed! Please Log in your account.", "dismiss", {duration: 2500})
      })
    }
    else{
      this.http.post<userModel>('api/user-account/login', {
        username: username,
        password: password
      }, {withCredentials:true}).subscribe(data=>{
        
        if(!data){
          this.snackbar.open('Incorrect Username or Password', '', {duration: 1000})
        }
        else if(data.user_rights == 1 || data.useracc){
          this.router.navigate(['/Ecopack/Dashboard']);
          this.snackbar.open(`Welcome ${data.username}!`, 'Dimiss', {duration:3000})
          this.userInfos = data
        }
        else{
          this.router.navigate(['/Ecopack']);
          this.snackbar.open(`Welcome ${data.username}!`, 'Dimiss', {duration:3000})
          this.userInfos = data
        }
      })
    }
  }

  orderPatch(link: string, data: any): Observable<any>{
    return this.http.patch<any>(link, data);
  }

  movementPost(link: string, data: orderList[]): Observable<orderList[]>{
    return this.http.post<orderList[]>(link, data)
    // return data;
  }

  getGeneralData(http: string, data:any): Observable<any[]>{
    return this.http.post<any[]>(http, data)
  }
  
}

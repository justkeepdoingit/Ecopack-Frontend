import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { userModel } from './models/usermodels.model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { FrontPageComponent } from './front-page/front-page.component';
import { orderList } from './models/orderList.model';
import { MatDialog } from '@angular/material/dialog';
import { rejectList } from './models/rejectList.model';
@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(public http: HttpClient, public formBuilder: UntypedFormBuilder, public snackbar: MatSnackBar, public cookieService: CookieService,
      public router: Router, public dialog: MatDialog
    ) { 
  } 

  userInfos!: userModel;

  getPlannerOrders(): Observable<orderList[]>{
    return this.http.get<orderList[]>('https://ecopack2.herokuapp.com/order-list/planners')
  }

  getLineupOrders(): Observable<orderList[]>{
    return this.http.get<orderList[]>('https://ecopack2.herokuapp.com/order-list/lineupOrders')
  }

  getConverting(): Observable<orderList[]>{
    return this.http.get<orderList[]>('https://ecopack2.herokuapp.com/order-list/convertOrders')
  }

  getFgOrders(): Observable<orderList[]>{
    return this.http.get<orderList[]>('https://ecopack2.herokuapp.com/order-list/fgOrders')
  }

  getAllUsers(): Observable<userModel[]>{
    return this.http.get<userModel[]>('https://ecopack2.herokuapp.com/user-account/getAllUsers')
  }

  getRejects(orderid: any): Observable<rejectList>{
    return this.http.get<rejectList>(`https://ecopack2.herokuapp.com/order-list/getReject/${orderid}`)
  } 

  getInfo(id: number): Observable<userModel>{
    return this.http.get<userModel>(`https://ecopack2.herokuapp.com/user-account/findUser/${id}`, {withCredentials:true})
  }

  updateReject(data:rejectList, id: any): Observable<rejectList>{
    return this.http.post<rejectList>(`https://ecopack2.herokuapp.com/order-list/updateReject/${id}`, data);
  }

  getOrderStatus(): Observable<any[]>{
    return this.http.get<any[]>('https://ecopack2.herokuapp.com/order-list/getStatuses');
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
    this.http.patch<userModel>(`https://ecopack2.herokuapp.com/user-account/updateUsers/${datas.id}`,{
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
      this.http.post<userModel>('https://ecopack2.herokuapp.com/user-account/register',{
        username: username,
        password: password
      }).subscribe(data=>{
        this.snackbar.open("Account registed! Please Log in your account.", "dismiss", {duration: 2500})
      })
    }
    else{
      this.http.post<userModel>('https://ecopack2.herokuapp.com/user-account/login', {
        username: username,
        password: password
      }, {withCredentials:true}).subscribe(data=>{
        if(!data){
          this.snackbar.open('Incorrect Username or Password', '', {duration: 1000})
        }
        else if(data){
          this.cookieService.set('id', data.id.toString())
          this.cookieService.set('user_rights', data.user_rights.toString())
          this.cookieService.set('planner', data.planner.toString())
          this.cookieService.set('converting', data.converting.toString())
          this.cookieService.set('delivery', data.delivery.toString())
          this.cookieService.set('edit_orders', data.edit_orders.toString())
          this.cookieService.set('lineup', data.lineup.toString())
          this.cookieService.set('fg', data.fg.toString())
          this.cookieService.set('returns', data.returns.toString())
          this.cookieService.set('status_page', data.status_page.toString())
          this.cookieService.set('useracc', data.useracc.toString())
          this.cookieService.set('import_orders', data.import_orders.toString())
          if(data.user_rights == 1 || data.useracc){
            this.router.navigate(['/Ecopack/Dashboard']);
            this.snackbar.open(`Welcome ${data.username}!`, 'Dimiss', {duration:3000})
            this.userInfos = data
          }
          else{
            this.router.navigate(['/Ecopack']);
            this.snackbar.open(`Welcome ${data.username}!`, 'Dimiss', {duration:3000})
            this.userInfos = data
          }
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

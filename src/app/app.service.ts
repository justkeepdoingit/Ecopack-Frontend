import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { userModel } from './models/usermodels.model';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { orderList } from './models/orderList.model';
import { MatDialog } from '@angular/material/dialog';
import { rejectList } from './models/rejectList.model';
import { deliveryModel } from './models/deliveryModel.mode';
import { shippingList } from './models/shippingMode.model';
import { packingModel } from './models/packingModel.model';
import { truckModel } from './models/truckModel.model';
import { itemModel } from './models/itemMode.model';
import { pickingModel, pickingModel2 } from './models/pickingModel.model';
@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(public http: HttpClient, public formBuilder: UntypedFormBuilder, public snackbar: MatSnackBar, public cookieService: CookieService,
    public router: Router, public dialog: MatDialog
  ) {
  }

  userInfos!: userModel;

  getPlannerOrders(): Observable<orderList[]> {
    return this.http.get<orderList[]>('https://ecopack2.herokuapp.com/order-list/planners')
  }

  saveTruck(data: truckModel): Observable<truckModel> {
    return this.http.post<truckModel>('https://ecopack2.herokuapp.com/packing-list/saveTruck', data)
  }

  savePld(data: any): Observable<any> {
    return this.http.post<any>('https://ecopack2.herokuapp.com/packing-list/savePld', data)
  }

  deletePld(data: any): Observable<any> {
    return this.http.delete<any>(`https://ecopack2.herokuapp.com/packing-list/deletePld/${data}`)
  }

  getTrucks(): Observable<truckModel[]> {
    return this.http.get<truckModel[]>('https://ecopack2.herokuapp.com/packing-list/getTrucks')
  }

  getTruckInfo(data: packingModel): Observable<any> {
    return this.http.get<any>(`https://ecopack2.herokuapp.com/packing-list/findTruckInfo/${data.id}`)
  }

  getTruckInfo2(data: any): Observable<any> {
    return this.http.get<any>(`https://ecopack2.herokuapp.com/packing-list/findTruckInfo/${data}`)
  }

  get1Truck(data: any): Observable<truckModel> {
    return this.http.get<truckModel>(`https://ecopack2.herokuapp.com/packing-list/findTruck/${data}`)
  }

  getVolume(): Observable<itemModel[]> {
    return this.http.get<itemModel[]>('https://ecopack2.herokuapp.com/order-list/getVolume')
  }

  getLineupOrders(): Observable<orderList[]> {
    return this.http.get<orderList[]>('https://ecopack2.herokuapp.com/order-list/lineupOrders')
  }

  getConverting(): Observable<orderList[]> {
    return this.http.get<orderList[]>('https://ecopack2.herokuapp.com/order-list/convertOrders')
  }

  getFgOrders(): Observable<orderList[]> {
    return this.http.get<orderList[]>('https://ecopack2.herokuapp.com/order-list/fgOrders')
  }

  getDeliveryOrders(): Observable<shippingList[]> {
    return this.http.get<shippingList[]>('https://ecopack2.herokuapp.com/order-list/deliveryOrders')
  }

  getPacking(): Observable<packingModel[]> {
    return this.http.get<packingModel[]>('https://ecopack2.herokuapp.com/packing-list')
  }

  getAllUsers(): Observable<userModel[]> {
    return this.http.get<userModel[]>('https://ecopack2.herokuapp.com/user-account/getAllUsers')
  }

  getRejects(orderid: any): Observable<rejectList> {
    return this.http.get<rejectList>(`https://ecopack2.herokuapp.com/order-list/getReject/${orderid}`)
  }

  deletePacking(data: packingModel): Observable<any> {
    return this.http.delete<any>(`https://ecopack2.herokuapp.com/packing-list/deletePacking/${data.id}`)
  }

  getInfo(id: number): Observable<userModel> {
    return this.http.get<userModel>(`https://ecopack2.herokuapp.com/user-account/findUser/${id}`, { withCredentials: true })
  }

  getShipping(id: number | undefined): Observable<deliveryModel[]> {
    return this.http.get<deliveryModel[]>(`https://ecopack2.herokuapp.com/order-list/getShipping/${id}`)
  }

  getShippingPl(id: number): Observable<any[]> {
    return this.http.get<any[]>(`https://ecopack2.herokuapp.com/order-list/getShippingPl/${id}`)
  }

  updateReject(data: rejectList, id: any): Observable<rejectList> {
    return this.http.post<rejectList>(`https://ecopack2.herokuapp.com/order-list/updateReject/${id}`, data);
  }

  updatePrio(data: any, id: number): Observable<pickingModel2[]> {
    return this.http.patch<pickingModel2[]>(`https://ecopack2.herokuapp.com/packing-list/updatePrio/${id}`, data)
  }

  getOrderStatus(): Observable<any[]> {
    return this.http.get<any[]>('https://ecopack2.herokuapp.com/order-list/getStatuses');
  }

  getPicking(sw: number): Observable<pickingModel[]> {
    return this.http.get<pickingModel[]>(`https://ecopack2.herokuapp.com/order-list/getPicking/${sw}`);
  }

  savePacking(data: any, list: any[]): Observable<any> {
    return this.http.post<any[]>('https://ecopack2.herokuapp.com/packing-list/savePacking', {
      data, list
    })
  }

  editPacking(data: any, list: any[]): Observable<any> {
    return this.http.post<any[]>('https://ecopack2.herokuapp.com/packing-list/editPacking', {
      data, list
    })
  }

  updatePending(data: any): Observable<any> {
    return this.http.post<any>('https://ecopack2.herokuapp.com/order-list/updatePending', data)
  }

  // updateVolume(data: itemModel): Observable<itemModel[]> {
  //   return this.http.post<itemModel[]>(`https://ecopack2.herokuapp.com/order-list/updateVolume/${data.id}`, data);
  // }

  updateVolume(data: any): Observable<any[]> {
    return this.http.post<any[]>(`https://ecopack2.herokuapp.com/order-list/updateVolume`, data);
  }

  updateUsers(datas: userModel) {
    let rights: number;
    if (datas.username != "admin" && datas.planner && datas.converting && datas.delivery && datas.edit_orders && datas.lineup && datas.fg && datas.returns && datas.status_page && datas.import_orders && datas.useracc && datas.packing) {
      rights = 1
    }
    else if (datas.username == "admin") {
      rights = 1;
    }
    else {
      rights = 2
    }
    this.http.patch<userModel>(`https://ecopack2.herokuapp.com/user-account/updateUsers/${datas.id}`, {
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
      packing: datas.packing,
      useracc: datas.useracc,
      contact: datas.contact,
      email: datas.email
    }).subscribe()
  }

  logreg(username: string, password: string, status: number) {
    if (status == 2) {
      this.http.post<userModel>('https://ecopack2.herokuapp.com/user-account/register', {
        username: username,
        password: password
      }).subscribe(data => {
        this.snackbar.open("Account registed! Please Log in your account.", "dismiss", { duration: 2500 })
      })
    }
    else {
      this.http.post<userModel>('https://ecopack2.herokuapp.com/user-account/login', {
        username: username,
        password: password
      }, { withCredentials: true }).subscribe(data => {
        if (!data) {
          this.snackbar.open('Incorrect Username or Password', '', { duration: 1000 })
        }
        else if (data) {
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
          if (data.user_rights == 1 || data.useracc) {
            this.router.navigate(['/Ecopack/Dashboard']);
            this.snackbar.open(`Welcome ${data.username}!`, 'Dimiss', { duration: 3000 })
            this.userInfos = data
          }
          else {
            this.router.navigate(['/Ecopack']);
            this.snackbar.open(`Welcome ${data.username}!`, 'Dimiss', { duration: 3000 })
            this.userInfos = data
          }
        }

      })
    }
  }

  orderPatch(link: string, data: any): Observable<any> {
    return this.http.patch<any>(link, data);
  }

  movementPost(link: string, data: orderList[]): Observable<orderList[]> {
    return this.http.post<orderList[]>(link, data)
    // return data;
  }

  getGeneralData(http: string, data: any): Observable<any[]> {
    return this.http.post<any[]>(http, data)
  }

}

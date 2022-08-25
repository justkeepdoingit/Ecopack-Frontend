import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AppService } from '../app.service';
@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.scss'],
  animations: [
    trigger('slideIn', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateX(30%)' }),
        animate(200, style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 }))
      ])
    ]),
  ]
})
export class FrontPageComponent implements OnInit {

  constructor(private appservice: AppService) {

  }

  ngOnInit(): void {
    this.user_rights = this.appservice.cookieService.get('user_rights')
    this.planner = this.appservice.cookieService.get('planner')
    this.converting = this.appservice.cookieService.get('converting')
    this.delivery = this.appservice.cookieService.get('delivery')
    this.edit_orders = this.appservice.cookieService.get('edit_orders')
    this.lineup = this.appservice.cookieService.get('lineup')
    this.fg = this.appservice.cookieService.get('fg')
    this.returns = this.appservice.cookieService.get('returns')
    this.status_page = this.appservice.cookieService.get('status_page')
    this.import_orders = this.appservice.cookieService.get('import_orders')
    this.useracc = this.appservice.cookieService.get('useracc')
    this.id = this.appservice.cookieService.get('id')
    this.packing = this.appservice.cookieService.get('packing')
    this.classStatus.dashboard = true;

    if (this.id) {
      this.appservice.getInfo(parseInt(this.id)).subscribe()
      if (this.useracc == 'true' || this.user_rights == '1') {
        this.appservice.router.navigate(['Ecopack/Dashboard'])
      }
      else if (this.appservice.cookieService.get('user_rights') != '1') {
        // if (this.appservice.cookieService.get('useracc') != 'true') {
        //   this.appservice.router.navigate(['Ecopack'])
        // }
        if (this.edit_orders == 'true') {
          this.appservice.router.navigate(['Ecopack/Edit_Orders'])
        }
        else if (this.import_orders == 'true') {
          this.appservice.router.navigate(['Ecopack/Import_Orders'])
        }
        else if (this.status_page == 'true') {
          this.appservice.router.navigate(['Ecopack/Status_Page'])
        }
        else if (this.planner == 'true') {
          this.appservice.router.navigate(['Ecopack/Planner'])
        }
        else if (this.lineup == 'true') {
          this.appservice.router.navigate(['Ecopack/Line_Up'])
        }
        else if (this.converting == 'true') {
          this.appservice.router.navigate(['Ecopack/Converting'])
        }
        else if (this.fg == 'true') {
          this.appservice.router.navigate(['Ecopack/Finished_Goods'])
        }
        else if (this.delivery == 'true') {
          this.appservice.router.navigate(['Ecopack/Delivery'])
        }
        else if (this.packing == 'true') {
          this.appservice.router.navigate(['Ecopack/Packing'])
        }
        else if (this.returns == 'true') {
          this.appservice.router.navigate(['Ecopack/Return'])
        }
      }
    }
    else {
      this.appservice.router.navigate([''])
    }

  }
  id: string = '';
  user_rights: string = '';
  planner: string = '';
  converting: string = '';
  delivery: string = '';
  edit_orders: string = '';
  lineup: string = '';
  fg: string = '';
  returns: string = '';
  status_page: string = '';
  import_orders: string = '';
  useracc: string = '';
  packing: string = '';

  classStrings = {
    dashboardInac: 'bg-gray-900 block hover:bg-primary-700 hover:text-secondary-50 cursor-pointer transition-all text-white px-3 py-2 rounded-md text-sm font-semibold',
    dashboardAcc: 'bg-gray-900 block bg-primary-700 text-secondary-50 cursor-pointer text-white px-3 py-2 rounded-md text-sm font-semibold',
    mobileInac: 'bg-gray-900 hover:bg-gray-700 transition-all hover:text-primary-700 cursor-pointer text-white block px-3 py-2 rounded-md text-base font-medium',
    mobileAcc: 'bg-gray-900 text-primary-700 hover:bg-gray-700 transition-all hover:text-primary-700 cursor-pointer text-white block px-3 py-2 rounded-md text-base font-medium'
  }
  classStatus = {
    dashboard: false,
    statusPage: false,
    planner: false,
    editOrders: false,
    lineup: false,
    importOrders: false,
    converting: false,
    fg: false,
    delivery: false,
    packing: false,
    returns: false
  }

  menuCheck: boolean = false;
  openMenu() {
    const menuButton = document.getElementById('menuB');
    $("#menuB").mouseenter(() => {
      menuButton!.style.display = 'block';
      this.menuCheck = true
    }).mouseleave(() => {
      menuButton!.style.display = 'none';
      this.menuCheck = false
    })
  }
  dropdownCheck: boolean = false;
  showDropdown() {
    const dropdown = document.getElementById('showDropdown')
    if (!this.dropdownCheck) {
      dropdown!.style.display = 'block'
      this.dropdownCheck = true
    }
    else {
      dropdown!.style.display = 'none'
      this.dropdownCheck = false
    }
  }
  closeDrowpdown() {
    const dropdown = document.getElementById('showDropdown')
    dropdown!.style.display = 'none'
    this.dropdownCheck = false
  }


  logout() {
    this.appservice.cookieService.delete('id', '/')
    this.appservice.cookieService.delete('user_rights', '/')
    this.appservice.cookieService.delete('planner', '/')
    this.appservice.cookieService.delete('converting', '/')
    this.appservice.cookieService.delete('delivery', '/')
    this.appservice.cookieService.delete('edit_orders', '/')
    this.appservice.cookieService.delete('lineup', '/')
    this.appservice.cookieService.delete('fg', '/')
    this.appservice.cookieService.delete('returns', '/')
    this.appservice.cookieService.delete('status_page', '/')
    this.appservice.cookieService.delete('useracc', '/')
    this.appservice.cookieService.delete('import_orders', '/')

    //
    this.appservice.cookieService.delete('id', '/Ecopack')
    this.appservice.cookieService.delete('user_rights', '/Ecopack')
    this.appservice.cookieService.delete('planner', '/Ecopack')
    this.appservice.cookieService.delete('converting', '/Ecopack')
    this.appservice.cookieService.delete('delivery', '/Ecopack')
    this.appservice.cookieService.delete('edit_orders', '/Ecopack')
    this.appservice.cookieService.delete('lineup', '/Ecopack')
    this.appservice.cookieService.delete('fg', '/Ecopack')
    this.appservice.cookieService.delete('returns', '/Ecopack')
    this.appservice.cookieService.delete('status_page', '/Ecopack')
    this.appservice.cookieService.delete('useracc', '/Ecopack')
    this.appservice.cookieService.delete('import_orders', '/Ecopack')
    this.appservice.http.get('api/user-account/logout', { withCredentials: true }).subscribe(() => {
      this.appservice.router.navigate([''])
    })
  }
}

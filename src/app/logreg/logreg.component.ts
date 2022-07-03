import { Component, OnInit } from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import { FormGroup } from '@angular/forms';
import { LogregService } from './logreg.service';
import { FormGroupDirective, Validators } from '@angular/forms';
import { AppService } from '../app.service';
@Component({
  selector: 'app-logreg',
  templateUrl: './logreg.component.html',
  styleUrls: ['./logreg.component.scss'],
  animations: [
    trigger('slideIn', [
      transition('void => *', [
        style({opacity: 0, transform: 'translateX(30%)'}),
        animate(200, style({opacity: 1, transform: 'translateX(0)'}))
      ])
    ]),
    trigger('fadeIn', [
      transition('void => *', [
        style({opacity: 0}),
        animate(300, style({opacity: 1}))
      ])
    ]),
  ]
})
export class LogregComponent implements OnInit {

  constructor(private logreg: LogregService, private appservice: AppService) { 
    this.adminCookies = appservice.cookieService.get('user_rights')
      this.userAccCookies = appservice.cookieService.get('useracc')

  }

  adminCookies: string = '';
  userAccCookies: string = '';

  userLogin = new FormGroup({});
  userReg = new FormGroup({});
  ngOnInit(): void {
    this.userLogin = this.logreg.formBuilders.group({
      loguser: ['', Validators.required],
      logpass: ['', Validators.required],
    })
    this.userReg = this.logreg.formBuilders.group({
      reguser: ['', Validators.required],
      regpass: ['', Validators.required],
    })
    
    if(this.adminCookies == '1' || this.userAccCookies == 'true'){
      this.appservice.router.navigate(['Ecopack/Dashboard'])
    }
    else if((this.adminCookies != '1' || this.userAccCookies != 'true') && (this.adminCookies || this.userAccCookies)){
      this.appservice.router.navigate([''])
    }


  }

  hide = true;
  value='';
  reg:boolean = false;


  register(data: any, fd: FormGroupDirective){
    const registers = this.appservice.logreg(data.reguser, data.regpass, 2);

    setTimeout(() => {
      this.reg=false
    }, 500);

    fd.resetForm()
    this.userLogin.reset();
  }

  login(data: any){
    this.appservice.logreg(data.loguser, data.logpass, 1);
  }
}

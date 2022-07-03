import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
@Injectable({
  providedIn: 'root'
})
export class LogregService{

  constructor(public formBuilders: FormBuilder, public snackbar: MatSnackBar, public http: HttpClient,
      public router: Router, private appservice: AppService
    ) { 
      
      
  }
}

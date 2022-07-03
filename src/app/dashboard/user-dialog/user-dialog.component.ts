import { Component, OnInit, Inject} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { userModel } from 'src/app/models/usermodels.model';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private userInfo: any, private appservice: AppService, private dialogRef: MatDialogRef<UserDialogComponent>) { 
    this.userAddInfo = this.userInfo;
  }

  userAddInfo: userModel;
  additionalInfo = new FormGroup({});


  ngOnInit(): void {
    this.additionalInfo = this.appservice.formBuilder.group({
      id: [this.userAddInfo.id],
      firstname: [this.userAddInfo.firstname],
      lastname: [this.userAddInfo.lastname],
      contact: [this.userAddInfo.contact, [Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      email: [this.userAddInfo.email, Validators.email],
      username: [this.userAddInfo.username],
      password: [this.userAddInfo.password],
      planner: [this.userAddInfo.planner],
      converting: [this.userAddInfo.converting],
      delivery: [this.userAddInfo.delivery],
      edit_orders: [this.userAddInfo.edit_orders],
      lineup: [this.userAddInfo.lineup],
      fg: [this.userAddInfo.fg],
      returns: [this.userAddInfo.returns],
      status_page: [this.userAddInfo.status_page],
      useracc: [this.userAddInfo.useracc],
      import_orders: [this.userAddInfo.import_orders]
    })
  }

  submit: number = 1;
  cancel: number = 0;

  saveInfo(userInfos: userModel){
    this.appservice.updateUsers(userInfos);
    this.dialogRef.close(1);
  }

  replace(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    if(filterValue.startsWith('09')) {
      this.additionalInfo.patchValue({
        contact: '9'
      })
    }
  }

}

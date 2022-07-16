import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { FrontPageComponent } from '../front-page.component';

@Component({
  selector: 'app-import-orders',
  templateUrl: './import-orders.component.html',
  styleUrls: ['./import-orders.component.scss']
})
export class ImportOrdersComponent implements OnInit {

  constructor(private appservice: AppService, private frontpage: FrontPageComponent) {
    frontpage.classStatus.statusPage = false;
    frontpage.classStatus.dashboard = false;
    frontpage.classStatus.planner = false;
    frontpage.classStatus.editOrders = false;
    frontpage.classStatus.lineup = false;
    frontpage.classStatus.importOrders = true
    frontpage.classStatus.converting = true
    frontpage.classStatus.fg = false
    frontpage.classStatus.delivery = false
    frontpage.classStatus.packing = false
  }

  ngOnInit(): void {
  }


  reset: string = ''

  selectedFile: File = new File([""], '');
  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0]
  }

  onUpload() {
    if (this.selectedFile.size == 0) {
      this.appservice.snackbar.open("No File Chosen", '', { duration: 1000 })
    }
    else {
      if (confirm("Upload This File?")) {
        let fd = new FormData()
        fd.append("csv", this.selectedFile, this.selectedFile.name)
        this.appservice.getGeneralData("http://localhost:3000/order-list/uploads", fd).subscribe(
          data => {
            this.reset = ''
            this.appservice.snackbar.open("If No Data Appeared, Something Went Wrong When Uploading File. Please Check Your CSV", "Okay", { duration: 1000 })
          }
        )
      }
      else {
        this.appservice.snackbar.open("Please Check File To be Uploaded", '', { duration: 1000 })
      }
    }
  }
}

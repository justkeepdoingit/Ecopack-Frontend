import { Component, OnInit } from '@angular/core';
import { FrontPageComponent } from '../front-page.component';

@Component({
  selector: 'app-edit-orders',
  templateUrl: './edit-orders.component.html',
  styleUrls: ['./edit-orders.component.scss']
})
export class EditOrdersComponent implements OnInit {

  constructor(private frontpage:FrontPageComponent) {
    frontpage.classStatus.planner = false;
    frontpage.classStatus.dashboard = false;
    frontpage.classStatus.statusPage = false;
    frontpage.classStatus.editOrders = true;
    frontpage.classStatus.lineup = false;
    frontpage.classStatus.importOrders = false
   }

  ngOnInit(): void {
  }

}

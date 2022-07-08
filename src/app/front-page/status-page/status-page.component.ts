import { Component, OnInit } from '@angular/core';
import { FrontPageComponent } from '../front-page.component';

@Component({
  selector: 'app-status-page',
  templateUrl: './status-page.component.html',
  styleUrls: ['./status-page.component.scss']
})
export class StatusPageComponent implements OnInit {

  constructor(private frontpage: FrontPageComponent) {
    frontpage.classStatus.statusPage = true;
    frontpage.classStatus.dashboard = false;
    frontpage.classStatus.planner = false;
    frontpage.classStatus.editOrders = false;
    frontpage.classStatus.lineup = false;
    frontpage.classStatus.importOrders = false
    frontpage.classStatus.converting = false
  }

  ngOnInit(): void {
  }

}

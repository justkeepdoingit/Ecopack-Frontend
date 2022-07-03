import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FrontPageComponent } from './front-page/front-page.component';
import { LogregComponent } from './logreg/logreg.component';
import { PlannerComponent } from './front-page/planner/planner.component';
import { StatusPageComponent } from './front-page/status-page/status-page.component';
import { EditOrdersComponent } from './front-page/edit-orders/edit-orders.component';
import { LineupComponent } from './front-page/lineup/lineup.component';
import { ImportOrdersComponent } from './front-page/import-orders/import-orders.component';

const routes: Routes = [
  {path: 'Login', component: LogregComponent},
  {path: 'Ecopack', component: FrontPageComponent, children: [
    {path: 'Dashboard', component: DashboardComponent},
    {path: 'Status_Page', component: StatusPageComponent},
    {path: 'Planner', component: PlannerComponent},
    {path: 'Edit_Orders', component: EditOrdersComponent},
    {path: 'Line_Up', component: LineupComponent},
    {path: 'Import_Orders', component: ImportOrdersComponent}
  ]},
  {path: '', redirectTo:'Login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogregComponent } from './logreg/logreg.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DesignmoduleModule } from './designmodules/designmodule/designmodule.module';
import { FrontPageComponent } from './front-page/front-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { pipeUserRights } from './dashboard/userPipe.pipe';
import { UserDialogComponent } from './dashboard/user-dialog/user-dialog.component';
import { CookieService } from 'ngx-cookie-service';
import { StatusPageComponent } from './front-page/status-page/status-page.component';
import { PlannerComponent } from './front-page/planner/planner.component';
import { EditOrdersComponent } from './front-page/edit-orders/edit-orders.component';
import { PlannerDialogComponent } from './front-page/planner/planner-dialog/planner-dialog.component';
import { DatePipe } from '@angular/common';
import { LineupComponent } from './front-page/lineup/lineup.component';
import { LineupDialogComponent } from './front-page/lineup/lineup-dialog/lineup-dialog.component';
import { ImportOrdersComponent } from './front-page/import-orders/import-orders.component';
@NgModule({
  declarations: [
    AppComponent,
    LogregComponent,
    FrontPageComponent,
    DashboardComponent,
    pipeUserRights,
    UserDialogComponent,
    StatusPageComponent,
    PlannerComponent,
    EditOrdersComponent,
    PlannerDialogComponent,
    LineupComponent,
    LineupDialogComponent,
    ImportOrdersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DesignmoduleModule
  ],
  entryComponents: [UserDialogComponent, PlannerDialogComponent, LineupDialogComponent],
  providers: [CookieService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

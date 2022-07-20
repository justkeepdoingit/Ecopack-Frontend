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
import { ConvertingComponent } from './front-page/converting/converting.component';
import { ConvertDialogComponent } from './front-page/converting/convert-dialog/convert-dialog.component';
import * as CanvasJSAngularChart from '../assets/canvasjs.angular.component';
import { FgComponent } from './front-page/fg/fg.component';
import { FgDialogComponent } from './front-page/fg/fg-dialog/fg-dialog.component';
var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;
import { DataTablesModule } from "angular-datatables";
import { filterPipes } from './componentPipes/filterPipes.pipe';
import { filterPipes2 } from './componentPipes/filterPipes2.pipe';
import { DeliveryComponent } from './front-page/delivery/delivery.component';
import { DeliveryDialogComponent } from './front-page/delivery/delivery-dialog/delivery-dialog.component';
import { StatusDialogComponent } from './front-page/delivery/status-dialog/status-dialog.component';
import { PackingComponent } from './front-page/packing/packing.component';
import { PackingDialogComponent } from './front-page/packing/packing-dialog/packing-dialog.component';
import { TruckDialogComponent } from './front-page/packing/truck-dialog/truck-dialog.component';
import { VolumeDialogComponent } from './front-page/packing/volume-dialog/volume-dialog.component';
import { PackingInnerDialogComponent } from './front-page/packing/packing-dialog/packing-inner-dialog/packing-inner-dialog.component';
import { truckPipe } from './componentPipes/truckPipes.pipe';
import { EditDialogComponent } from './front-page/packing/edit-dialog/edit-dialog.component';
@NgModule({
    declarations: [
        CanvasJSChart,
        AppComponent,
        LogregComponent,
        FrontPageComponent,
        DashboardComponent,
        pipeUserRights,
        filterPipes,
        filterPipes2,
        truckPipe,
        UserDialogComponent,
        StatusPageComponent,
        PlannerComponent,
        EditOrdersComponent,
        PlannerDialogComponent,
        LineupComponent,
        LineupDialogComponent,
        ImportOrdersComponent,
        ConvertingComponent,
        ConvertDialogComponent,
        FgComponent,
        FgDialogComponent,
        DeliveryComponent,
        DeliveryDialogComponent,
        StatusDialogComponent,
        PackingComponent,
        PackingDialogComponent,
        TruckDialogComponent,
        VolumeDialogComponent,
        PackingInnerDialogComponent,
        EditDialogComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        DesignmoduleModule,
        DataTablesModule
    ],
    providers: [CookieService, DatePipe],
    bootstrap: [AppComponent]
})
export class AppModule { }

import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { pickingModel2 } from 'src/app/models/pickingModel.model';
import { truckModel, truckSelect } from 'src/app/models/truckModel.model';

@Component({
  selector: 'app-print-dialog',
  templateUrl: './print-dialog.component.html',
  styleUrls: ['./print-dialog.component.scss']
})
export class PrintDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private packing: any, private appservice: AppService,
    private dialogRef: MatDialogRef<PrintDialogComponent>, public datepipe: DatePipe) {
    this.packingInfo = packing.pld
  }

  ngOnInit(): void {
  }

  packingInfo: pickingModel2[] = [];
}

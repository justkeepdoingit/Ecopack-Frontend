import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';
// import { QRCodeModule } from 'angularx-qrcode';
// import { ZXingScannerModule } from '@zxing/ngx-scanner'
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRippleModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
const modules = [
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  ReactiveFormsModule,
  HttpClientModule,
  MatTableModule,
  MatSelectModule,
  MatSortModule,
  MatPaginatorModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatStepperModule,
  MatListModule,
  MatSnackBarModule,
  MatDialogModule,
  MatCheckboxModule,
  FormsModule,
  MatGridListModule,
  MatRippleModule,
  NgxPrintModule,
  // QRCodeModule,
  // ZXingScannerModule,
  MatDividerModule,
  MatProgressBarModule,
  MatCardModule,
  MatBadgeModule,
  MatTooltipModule,
  MatSidenavModule,
  MatAutocompleteModule
]
@NgModule({
  imports: [CommonModule],
  exports: [modules]
})
export class DesignmoduleModule { }

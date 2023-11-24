import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { MaterialModule } from './material/material.module';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { LoadingComponent } from './loading/loading.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { FormComponent } from './form/form.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AvatarComponent } from './avatar/avatar.component';
import { TranslateModule } from '@ngx-translate/core';
import { ChartRecordComponent } from './chart/chart-record/chart-record.component';
// import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    LoadingComponent,
    FormComponent,
    AvatarComponent,
    ChartRecordComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    NgxPermissionsModule.forChild(),
    TranslateModule,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    LoadingComponent,
    FormComponent,
    ChartRecordComponent,
    AvatarComponent,
    MaterialModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    TranslateModule,

  ]
})
export class SharedModule { }

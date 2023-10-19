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
import { TableComponent } from './table/table.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AvatarComponent } from './avatar/avatar.component';
import { TranslateModule } from '@ngx-translate/core';
// import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    LoadingComponent,
    FormComponent,
    TableComponent,
    AvatarComponent
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
    TableComponent,
    AvatarComponent,
    MaterialModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    TranslateModule,

  ]
})
export class SharedModule { }

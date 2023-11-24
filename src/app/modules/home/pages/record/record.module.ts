import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecordRoutingModule } from './record-routing.module';
import { ContentComponent } from './content/content.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { HomeComponent } from './pages/home/home.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NavbarComponent } from './components/navbar/navbar.component';


@NgModule({
  declarations: [
    ContentComponent,
    HomeComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RecordRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class RecordModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { ContentComponent } from './content/content.component';
import { HomeComponent } from './pages/home/home.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { FormScheduleComponent } from './components/form-schedule/form-schedule.component';
import { TimeComponent } from './components/time/time.component';


@NgModule({
  declarations: [
    ContentComponent,
    HomeComponent,
    FormScheduleComponent,
    TimeComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class LandingModule { }

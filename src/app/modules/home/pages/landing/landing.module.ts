import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { ContentComponent } from './content/content.component';
import { HomeComponent } from './pages/home/home.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [
    ContentComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    SharedModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class LandingModule { }

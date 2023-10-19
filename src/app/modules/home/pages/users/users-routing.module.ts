import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content/content.component';
import { HomeComponent } from '../users/pages/home/home.component';
// import { AuthGuard } from 'src/app/guards/auth.guard';
// import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path:'', component: ContentComponent,
    // canActivate: [AuthGuard, NgxPermissionsGuard],
    // data: { permissions: { only: ['ADMIN'], redirectTo: '/home' } },
    children:[
      {
        path:'', component: HomeComponent,

      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }

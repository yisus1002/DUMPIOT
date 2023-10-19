import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './content/content.component';
import { HomeComponent } from './pages/home/home.component';
import { ActivationComponent } from './pages/activation/activation.component';

const routes: Routes = [
  {
    path:'', component: ContentComponent,

    children:[
      {
        path:'', component: HomeComponent,
      },
      {
        path:'activation', component: ActivationComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecordRoutingModule { }

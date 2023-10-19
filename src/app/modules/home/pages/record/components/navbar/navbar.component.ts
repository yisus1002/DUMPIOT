import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-record',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  rutas:any[]=[
    {name:'Registro de cambios',path:'/record'},
    {name:'Registro de activación',path:'/record/activation'},
  ];

}

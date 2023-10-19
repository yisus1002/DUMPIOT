import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public anio:any;
  constructor() {

    const today= new Date();
    this.anio= today.getFullYear()
  }

}

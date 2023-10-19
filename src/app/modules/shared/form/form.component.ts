import { Component } from '@angular/core';
import { ControllerService } from 'src/app/services/controllers/controller.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  constructor(
    public _sctr: ControllerService,
  ) {
  }
}

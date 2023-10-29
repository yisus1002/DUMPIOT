import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ActivationService } from 'src/app/services/activation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit, OnDestroy {
  private Subscription:Subscription=new Subscription();
  constructor(
    public _sActi:ActivationService,
    public zone: NgZone
  ) { }
  ngOnDestroy(): void {
    this.Subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.zone.run(()=>{

    let sub= this._sActi.getActivation()
    .subscribe((data)=>{
      console.log(data);

    })
    this.Subscription.add(sub);
  })
  }

}

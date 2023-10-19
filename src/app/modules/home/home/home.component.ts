

import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, AfterViewChecked {

  togg:boolean=true;
  mod:any='side'

  constructor(
    private render2  : Renderer2,
    private elementRef: ElementRef
  ) {  }
  ngAfterViewChecked(): void {
    this.loadHTML()
  }
  ngAfterViewInit(): void {
  }
  ngOnInit(): void {
  }

  loadHTML() {
      const c1Width = this.elementRef.nativeElement.querySelector('mat-drawer').offsetWidth;
      const c2 =this.elementRef.nativeElement.querySelector('mat-drawer-content');
      const bkdrop =this.elementRef.nativeElement.querySelector('.mat-drawer-backdrop');
      (this.togg)?(
        this.render2.setStyle(c2,'margin-left', c1Width + 'px'),
        this.render2.removeClass(bkdrop,'mat-drawer-shown'),
        this.render2.setStyle(bkdrop, 'z-index','3')
        ):(
        this.render2.setStyle(c2,'margin-left', 0 + 'px'),
        this.render2.addClass(bkdrop,'mat-drawer-shown'),
        this.render2.setStyle(bkdrop, 'z-index','2')
        );
  }

}

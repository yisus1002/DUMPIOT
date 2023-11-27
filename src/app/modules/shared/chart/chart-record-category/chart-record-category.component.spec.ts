import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartRecordCategoryComponent } from './chart-record-category.component';

describe('ChartRecordCategoryComponent', () => {
  let component: ChartRecordCategoryComponent;
  let fixture: ComponentFixture<ChartRecordCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartRecordCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartRecordCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

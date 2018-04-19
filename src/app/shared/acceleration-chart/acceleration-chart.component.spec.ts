import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccelerationChartComponent } from './acceleration-chart.component';

describe('AccelerationChartComponent', () => {
  let component: AccelerationChartComponent;
  let fixture: ComponentFixture<AccelerationChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccelerationChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccelerationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

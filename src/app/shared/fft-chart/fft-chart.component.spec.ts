import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FftChartComponent } from './fft-chart.component';

describe('FftChartComponent', () => {
  let component: FftChartComponent;
  let fixture: ComponentFixture<FftChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FftChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FftChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccelerationComponent } from './acceleration.component';
import { TranslateModule } from '@ngx-translate/core';

describe('AccelerationComponent', () => {
  let component: AccelerationComponent;
  let fixture: ComponentFixture<AccelerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccelerationComponent ],
      imports: [
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccelerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in a h1 tag', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('PAGES.HOME.TITLE');
  }));
});

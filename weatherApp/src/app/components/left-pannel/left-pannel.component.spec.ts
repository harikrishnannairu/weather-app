import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPannelComponent } from './left-pannel.component';

describe('LeftPannelComponent', () => {
  let component: LeftPannelComponent;
  let fixture: ComponentFixture<LeftPannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeftPannelComponent]
    });
    fixture = TestBed.createComponent(LeftPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalHomeConsumptionComponent } from './total-home-consumption.component';

describe('TotalHomeConsumptionComponent', () => {
  let component: TotalHomeConsumptionComponent;
  let fixture: ComponentFixture<TotalHomeConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TotalHomeConsumptionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalHomeConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

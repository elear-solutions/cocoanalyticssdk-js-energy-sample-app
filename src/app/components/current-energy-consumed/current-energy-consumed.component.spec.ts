import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentEnergyConsumedComponent } from './current-energy-consumed.component';

describe('CurrentEnergyConsumedComponent', () => {
  let component: CurrentEnergyConsumedComponent;
  let fixture: ComponentFixture<CurrentEnergyConsumedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentEnergyConsumedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentEnergyConsumedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

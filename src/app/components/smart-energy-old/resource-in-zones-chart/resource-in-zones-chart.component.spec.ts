import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceInZonesChartComponent } from './resource-in-zones-chart.component';

describe('ResourceInZonesChartComponent', () => {
  let component: ResourceInZonesChartComponent;
  let fixture: ComponentFixture<ResourceInZonesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceInZonesChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceInZonesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

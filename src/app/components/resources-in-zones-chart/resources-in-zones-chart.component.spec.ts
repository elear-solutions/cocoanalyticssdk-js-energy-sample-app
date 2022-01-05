import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesInZonesChartComponent } from './resources-in-zones-chart.component';

describe('ResourcesInZonesChartComponent', () => {
  let component: ResourcesInZonesChartComponent;
  let fixture: ComponentFixture<ResourcesInZonesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourcesInZonesChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesInZonesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

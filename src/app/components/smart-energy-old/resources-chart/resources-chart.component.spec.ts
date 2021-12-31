import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesChartComponent } from './resources-chart.component';

describe('ResourcesChartComponent', () => {
  let component: ResourcesChartComponent;
  let fixture: ComponentFixture<ResourcesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourcesChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

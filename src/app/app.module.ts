import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import {
  MDBBootstrapModulesPro, CardsModule, NavbarModule,
  ChartSimpleModule, CollapseModule, AccordionModule, ModalModule, TimePickerModule, WavesModule, InputsModule, ButtonsModule, PreloadersModule, ProgressbarModule
} from 'ng-uikit-pro-standard';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { TotalHomeConsumptionComponent } from './components/total-home-consumption/total-home-consumption.component';
declare var Coco: any;
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { ChartsModule } from 'ng2-charts';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { DoughnutChartComponent } from './components/doughnut-chart/doughnut-chart.component';
import { ResourcesInZonesChartComponent } from './components/resources-in-zones-chart/resources-in-zones-chart.component';
import { CurrentEnergyConsumedComponent } from './components/current-energy-consumed/current-energy-consumed.component';


@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    TotalHomeConsumptionComponent,
    BarChartComponent,
    LineChartComponent,
    DoughnutChartComponent,
    ResourcesInZonesChartComponent,
    CurrentEnergyConsumedComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ChartsModule,
    AppRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    NavbarModule,
    WavesModule,
    ButtonsModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModulesPro.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

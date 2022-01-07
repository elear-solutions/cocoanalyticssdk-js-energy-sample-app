import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-current-energy-consumed',
  templateUrl: './current-energy-consumed.component.html',
  styleUrls: ['./current-energy-consumed.component.scss']
})
export class CurrentEnergyConsumedComponent implements OnInit {

  showChart: boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

}

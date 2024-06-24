import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public numOfJos!: number;
  public numOfCountries!: number;
  public subcription!: Subscription;

  constructor(private olympicService: OlympicService, private routerService: Router) {
    Chart.register(...registerables);
  }
  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }

  ngOnInit() {
    this.subcription = this.olympicService.getOlympics().subscribe(olympics => {
      if(olympics.length) {
        this.numOfCountries = olympics.length;
        this.numOfJos = olympics.reduce((acc, val) => acc + val.participations.length, 0);
        let chart = new Chart("piChart", {
          type: 'pie',
          data: {
            labels: olympics.map<string>((olympic) => olympic.country),
            datasets: [{
              label: "Graphic medals per contry",
              data:  olympics.map<number>((olympic) => olympic.participations.reduce((acc, val) => acc + val.medalsCount, 0)),
              borderWidth: 1
            }]
          },
          options: {
            plugins: {
              legend: {
                onClick: (e, legendItem, legend) => {
                  this.navToCountryDetail(legendItem.index!);
                },
              }
            }
          }
        })
      }
    })
  }

  private navToCountryDetail(index: number): void {
    this.routerService.navigateByUrl(`/detail/${index}`)
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexNonAxisChartSeries
} from 'ng-apexcharts';
import { Observable } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

export type ChartOptions = {
  chart: ApexChart;
  series: ApexNonAxisChartSeries;
  labels: string[];
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$!: Observable<Olympic[]>;
  public numOfJos!: number;
  public numOfCountries!: number;
  public chartOptions!: Partial<ChartOptions>;

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe(olympics => {
      this.numOfCountries = olympics.length;
      this.numOfJos = olympics.reduce((acc, val) => acc + val.participations.length, 0);
      this.chartOptions = {
        title: {
          text: "Graphic medals per contry"
        },
        labels: olympics.map<string>((olympic) => olympic.country),
        dataLabels: {
          formatter: function (val, opts) {
              return opts.w.config.series[opts.seriesIndex]
          },
        },
        series: olympics.map<number>((olympic) => olympic.participations.reduce((acc, val) => acc + val.medalsCount, 0)),
        chart: {
          height: 250,
          type: "pie"
        },
      }
    });
  }
}

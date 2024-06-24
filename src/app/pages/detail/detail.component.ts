import { Component, OnDestroy, OnInit } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { Observable, Subscription, partition, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-details',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy {
  public olympics$!: Observable<Olympic[]>;
  public title!: string;
  public entriesCount!: number;
  public athlethesCount!: number;
  public medalsCount!: number;
  public subcription!: Subscription;

  constructor(private olympicService: OlympicService, private route: ActivatedRoute, private routerService: Router) {
    Chart.register(...registerables);
  }
  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }

  ngOnInit(): void {
    this.subcription = this.olympicService.getOlympics().subscribe(olympics => {
      let olympic = olympics[this.route.snapshot.params['index']];

      if(olympic == undefined) {
        this.routerService.navigateByUrl("**");
        return;
      }
        
      this.title = olympic.country;
      this.entriesCount = olympic.participations.length;
      this.medalsCount = olympic.participations.reduce<number>((acc, partition) => acc += partition.medalsCount, 0);
      this.athlethesCount = olympic.participations.reduce<number>((acc, partition) => acc += partition.athleteCount, 0);

      let chart = new Chart("lineChart", {
        type: 'line',
        data: {
          labels: olympic.participations.map((partition) => partition.year).sort((a, b) => a - b),
          datasets: [{
            label: "Graphic medals per contry",
            data:  olympics[this.route.snapshot.params['index']].participations.map(partition => partition.medalsCount),
            borderWidth: 1
          }]
        }
      });
    });
  }
}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() text: string = '';
  @Input() count: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}

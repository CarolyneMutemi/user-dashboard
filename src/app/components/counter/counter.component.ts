import { Component, OnInit } from '@angular/core';
import { CounterService } from 'src/app/services/counter.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
  counter$: Observable<number>;

  constructor(private counterService: CounterService) {
    this.counter$ = this.counterService.counter$;
  }

  ngOnInit(): void {}

  increment(): void {
    this.counterService.increment();
  }

  decrement(): void {
    this.counterService.decrement();
  }

  reset(): void {
    this.counterService.reset();
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private counter = new BehaviorSubject<number>(0);
  counter$ = this.counter.asObservable();

  increment(): void {
    this.counter.next(this.counter.value + 1);
  }

  decrement(): void {
    this.counter.next(this.counter.value - 1);
  }

  reset(): void {
    this.counter.next(0);
  }

  getCurrentValue(): number {
    return this.counter.value;
  }
}
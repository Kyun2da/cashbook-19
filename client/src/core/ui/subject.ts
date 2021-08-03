import type { Observer } from './observer';

class Subject {
  private observers: Observer[];

  constructor() {
    this.observers = [];
  }

  subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer): void {
    const removeIndex = this.observers.findIndex((obs) => observer === obs);

    if (removeIndex !== -1) {
      this.observers = this.observers.slice(removeIndex, 1);
    }
  }

  notify(prevState: StoreState, nextState: StoreState): void {
    if (this.observers.length > 0) {
      this.observers.forEach((observer: Observer) => observer.update(prevState, nextState));
    }
  }
}

export default Subject;

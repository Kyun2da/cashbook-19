import type { Observer } from './observer';

class Subject {
  private observers: Observer[];

  constructor() {
    this.observers = [];
  }

  // Add an observer to this.observers.
  subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  // Remove an observer from this.observers.
  unsubscribe(observer: Observer): void {
    const removeIndex = this.observers.findIndex((obs) => observer === obs);

    if (removeIndex !== -1) {
      this.observers = this.observers.slice(removeIndex, 1);
    }
  }

  // Loops over this.observers and calls the update method on each observer.
  // The state object will call this method everytime it is updated.
  notify(data: Record<string, any>): void {
    if (this.observers.length > 0) {
      this.observers.forEach((observer: Observer) => observer.update(data));
    }
  }
}

export default Subject;

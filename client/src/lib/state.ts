import Subject from './subject';

class State extends Subject {
  private state: Record<string, any>;

  constructor() {
    super();
    this.state = {};
  }

  // Update the state.
  // Calls the update method on each observer.
  update(data = {}): void {
    this.state = Object.assign(this.state, data);
    this.notify(this.state);
  }

  // Get the state.
  get(): Record<string, any> {
    return this.state;
  }
}

export default State;

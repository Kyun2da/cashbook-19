import Subject from './subject';

class State extends Subject {
  private state: StoreState;

  constructor() {
    super();
    this.state = {
      router: {
        pathname: '',
        search: '',
        hash: '',
      },
      login: null,
      date: null,
      categories: [],
      payments: [],
      records: [],
    };
  }

  // Update the state.
  // Calls the update method on each observer.
  update(data = {}): void {
    this.state = Object.assign(this.state, data);
    this.notify(this.state);
  }

  // Get the state.
  get(): StoreState {
    return this.state;
  }
}

export default State;

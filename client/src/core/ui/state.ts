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
      filter: {
        income: true,
        expenditure: true,
      },
    };
  }

  update(data = {}): void {
    const prevState = this.state;
    this.state = {
      ...this.state,
      ...data,
    };
    this.notify(prevState, this.state);
  }

  get(): StoreState {
    return this.state;
  }
}

export default State;

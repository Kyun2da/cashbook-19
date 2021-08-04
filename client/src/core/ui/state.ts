import Subject from './subject';

class State extends Subject {
  private state: StoreState;

  constructor() {
    super();

    const now = new Date();
    this.state = {
      router: {
        pathname: '',
        search: '',
        hash: '',
      },
      user: null,
      date: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      },
      categories: [],
      payments: [],
      records: [],
      filter: {
        income: true,
        expenditure: true,
      },
      loading: false,
      alert: null,
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

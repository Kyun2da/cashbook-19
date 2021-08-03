export interface Observer {
  update(prevState: StoreState, nextState: StoreState): void;
}

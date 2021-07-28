export interface Observer {
  // Gets called by the Subject::notify method.
  update(data: StoreState): void;
}

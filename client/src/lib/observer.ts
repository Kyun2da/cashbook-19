export interface Observer {
  // Gets called by the Subject::notify method.
  update(data: Record<string, unknown>): void;
}

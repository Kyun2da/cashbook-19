import type State from '@/lib/state';

class Form {
  private appState: State;

  // Passing in our state object and setting it as a class property.
  constructor(state: State) {
    this.appState = state;
  }

  template(): string {
    return `<div>
        <form id="add-user">
          <label for="username">Add a User</label>
          <input id="username" type="text" name="name">
          <button type="submit">Add</button>
        </form>
      </div>`;
  }

  render(selector: string): void {
    const markup = this.template();
    const parent = document.querySelector(selector);

    parent.innerHTML = markup;

    this.bindEvents();
  }

  // Bind an event on submit for the add user form.
  bindEvents(): void {
    const form = document.querySelector('#add-user') as HTMLFormElement;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = form.querySelector('input[name="name"]') as HTMLInputElement;
      const { value: name } = nameInput;

      if (!name) {
        return;
      }

      // Getting the current state.
      const state = this.appState.get();

      const users = [...state.users, { id: state.users.length + 1, name }];

      nameInput.value = '';

      // Updating state will prompt a re-render via the notify method being called.
      this.appState.update({
        ...state,
        users,
      });
    });
  }
}

export default Form;

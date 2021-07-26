import { IUser } from '../types';
import type { Observer } from '../lib/Observer';

class List implements Observer {
  template(state: Record<string, any>): string {
    return `<ul>
    ${state.users.map((user: IUser) => `<li>${user.name}</li>`).join('\n')}
    </ul>`;
  }

  render(state: Record<string, any>, selector = 'app'): void {
    const markup = this.template(state);
    const parent = document.getElementById(selector);

    parent.innerHTML = markup;
  }

  // This method will be called by the Subject(state) whenever it updates.
  // Notice how it prompts a re-render.
  update(state:Record<string, any>): void {
    this.render(state, 'user-list-container');
  }
}

export default List;

import State from '@/core/ui/state';

interface To {
  pathname?: string;
  search?: string;
  hash?: string;
}

function createUrl(to: To) {
  return (to.pathname ?? '') + (to.search ?? '') + (to.hash ?? '');
}

export default class Router {
  private store: State;

  constructor(store: State) {
    this.store = store;

    window.addEventListener('popstate', this.onPopState.bind(this));
    window.addEventListener('load', this.updateLocation.bind(this));
  }

  push(to: To): void {
    const url = createUrl(to);
    window.history.pushState(null, '', url);
    this.updateLocation();
  }

  replace(to: To): void {
    const url = createUrl(to);
    window.history.replaceState(null, '', url);
    this.updateLocation();
  }

  go(n: number): void {
    window.history.go(n);
    this.updateLocation();
  }

  back(): void {
    this.go(-1);
  }

  forward(): void {
    this.go(1);
  }

  updateLocation(): void {
    const { pathname, search, hash } = window.location;

    this.store.update({
      router: {
        pathname,
        search,
        hash,
      },
    });
  }

  onPopState(): void {
    this.updateLocation();
  }
}

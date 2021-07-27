import '@/core/styles/reset.css';
import '@/core/styles/global.scss';

import State from '@/lib/state';
import Router from '@/lib/router';

import Header from '@/views/header';
import A from '@/views/a';
import B from '@/views/b';
import C from '@/views/c';

const store = new State(); // 어플리케이션 상태
const router = new Router(store);

const header = new Header(router);
const a = new A();
const b = new B();
const c = new C();

store.subscribe(header);
store.subscribe(a);
store.subscribe(b);
store.subscribe(c);

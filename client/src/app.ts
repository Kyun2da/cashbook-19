import '@/core/styles/reset.css';
import '@/core/styles/global.scss';
import '@/assets/fonts/woowahan-cashbook-icons.css';

import State from '@/core/ui/state';
import Router from '@/core/utils/router';

import Header from '@/views/header';
import Main from '@/views/main';
import Calendar from '@/views/calendar';
import Statistics from '@/views/statistics';

const store = new State(); // 어플리케이션 상태
const router = new Router(store);

const header = new Header(router);
const main = new Main();
const calendar = new Calendar();
const statistics = new Statistics();

store.subscribe(header);
store.subscribe(main);
store.subscribe(calendar);
store.subscribe(statistics);

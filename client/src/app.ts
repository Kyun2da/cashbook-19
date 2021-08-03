import '@/core/styles/reset.css';
import '@/core/styles/global.scss';
import '@/assets/fonts/woowahan-cashbook-icons.css';
import dayjs from 'dayjs';

import State from '@/core/ui/state';
import Router from '@/core/utils/router';

import Header from '@/views/header';
import Main from '@/views/main';
import Calendar from '@/views/calendar';
import Statistics from '@/views/statistics';

import data from '@/assets/mockup/record';
import categoryData from '@/assets/mockup/category';
import paymentData from '@/assets/mockup/payment';

const store = new State();
const router = new Router(store);

const header = new Header(router, store);
const main = new Main(router, store);
const calendar = new Calendar(router, store);
const statistics = new Statistics(router, store);

store.subscribe(header);
store.subscribe(main);
store.subscribe(calendar);
store.subscribe(statistics);

store.update({
  date: { year: dayjs().year(), month: dayjs().month() + 1 },
  records: data.result,
  categories: categoryData.result,
  payments: paymentData.result,
});

import '@/core/styles/reset.css';
import '@/core/styles/global.scss';
import '@/assets/fonts/woowahan-cashbook-icons.css';

import 'dayjs/locale/ko';
import dayjs from 'dayjs';

import State from '@/core/ui/state';
import Router from '@/core/utils/router';

import Header from '@/views/header';
import Main from '@/views/main';
import Calendar from '@/views/calendar';
import Statistics from '@/views/statistics';
import Loading from '@/views/loading';
import paymentData from '@/assets/mockup/payment';
import { getRecords, init } from './core/utils/api';

dayjs.locale('ko');

const store = new State();
const router = new Router(store);

const header = new Header(router, store);
const main = new Main(router, store);
const calendar = new Calendar(router, store);
const statistics = new Statistics(router, store);
const loading = new Loading(null, store);

store.subscribe(header);
store.subscribe(main);
store.subscribe(calendar);
store.subscribe(statistics);
store.subscribe(loading);

const stateInit = async () => {
  const initData = await init(store);
  console.log(initData);
  if (!initData) {
    return;
  }
  store.update({
    user: initData.user,
    categories: initData.categories,
    payments: initData.payments,
  });

  const records = await getRecords(store);
  if (!records) {
    return;
  }
  store.update({
    records,
  });
};
stateInit();

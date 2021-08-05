import '@/core/styles/reset.css';
import '@/core/styles/global.scss';
import '@/assets/fonts/woowahan-cashbook-icons.css';

import 'dayjs/locale/ko';
import dayjs from 'dayjs';

import State from '@/core/ui/state';
import Router from '@/core/utils/router';

import Header from '@/views/header';
import Form from '@/views/main/form';
import MainList from '@/views/main/main-list';
import Table from '@/views/calendar/table';
import CalList from '@/views/calendar/cal-list';
import PieChart from '@/views/statistics/pie-chart';
import StatList from '@/views/statistics/stat-list';
import Loading from '@/views/loading';

import DateObserver from '@/observers/date';

import { getRecords, init } from './core/utils/api';
import Alert from './views/alert';
import CategoryModal from './views/category-modal';
import PaymentModal from './views/payment-modal';

dayjs.locale('ko');

const store = new State();
const router = new Router(store);

const header = new Header(router, store);
const form = new Form(router, store);
const mainList = new MainList(null, store);
const talbe = new Table(router, store);
const calList = new CalList(null, store);
const pieChart = new PieChart(router, store);
const statList = new StatList(null, store);
const loading = new Loading(null, store);
const alert = new Alert(null, store);
const categoryModal = new CategoryModal(null, store);
const paymentModal = new PaymentModal(null, store);

store.subscribe(header);
store.subscribe(form);
store.subscribe(mainList);
store.subscribe(talbe);
store.subscribe(calList);
store.subscribe(pieChart);
store.subscribe(statList);
store.subscribe(loading);
store.subscribe(alert);
store.subscribe(categoryModal);
store.subscribe(paymentModal);

const dateObserver = new DateObserver(store);
store.subscribe(dateObserver);

const stateInit = async () => {
  const initData = await init(store);
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

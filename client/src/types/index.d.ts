interface RouterState {
  pathname: string;
  search: string;
  hash: string;
}

interface User {
  name: string;
  avatarUri: string;
}

interface Category {
  id: string;
  type: 'income' | 'expenditure';
  name: string;
  color: string;
}

interface Payment {
  id: string;
  name: string;
}

interface CashRecord {
  id: string;
  categoryId: string;
  category: Category;
  paymentId: string;
  payment: Payment;
  title: string;
  value: number;
  date: Date;
}

interface DateState {
  year: number;
  month: number;
}

interface MainState {
  cashType: 'income' | 'expenditure';
  income: boolean;
  expenditure: boolean;
}

interface CalendarState {
  selection?: Date;
}

interface AlertState {
  error?: boolean;
  success?: boolean;
  title?: string;
  message?: string;
  okMessage?: string;
  okColor?: string;
  callback?: (ok: boolean) => void;
  cancelable?: boolean;
}

interface StatPageState {
  categoryId?: string;
  sumOfMonth?: [number, number, number, number, number, number, number, number, number, number, number, number];
}

type StoreStateValue =
  | RouterState
  | User
  | Category[]
  | Payment[]
  | CashRecord[]
  | DateState
  | MainState
  | boolean
  | AlertState
  | CalendarState
  | StatPageState;

interface StoreState {
  router: RouterState;
  user?: User;
  categories: Category[];
  payments: Payment[];
  records: CashRecord[];
  date: DateState;
  main: MainState;
  calendar: CalendarState;
  loading: boolean;
  alert?: AlertState;
  categoryModal: boolean;
  statPage: StatPageState;
}

type UpdateStoreState = Partial<StoreState>;

interface DonutRecord {
  id: string;
  name: string;
  color: string;
  value: number;
  percent: number;
}

interface CashRecordValueSum {
  income: number;
  expenditure: number;
}

interface CashRecordsAndSum {
  records: CashRecord[];
  sum: CashRecordValueSum;
}

type CashRecordGroupByDate = Record<string, CashRecordsAndSum>;

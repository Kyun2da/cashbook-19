interface RouterState {
  pathname: string;
  search: string;
  hash: string;
}

interface LoginState {
  avatar: string;
  username: string;
}

interface Category {
  id: number;
  type: 'income' | 'expenditure';
  name: string;
  color: string;
}

interface Payment {
  id: number;
  name: string;
}

interface CashRecord {
  id: number;
  categoryId: number;
  category: Category;
  paymentId: number;
  payment: Payment;
  title: string;
  value: number;
  date: Date;
}

interface DateState {
  year: number;
  month: number;
}

interface FilterState {
  income: boolean;
  expenditure: boolean;
}

interface StoreState extends Record<string, any> {
  router: RouterState;
  login: LoginState | null;
  categories: Category[];
  payments: Payment[];
  records: CashRecord[];
  date: DateState;
  filter: FilterState;
  loading: boolean;
}

interface DonutRecord {
  id: number;
  name: string;
  color: string;
  value: number;
  percent: number;
}

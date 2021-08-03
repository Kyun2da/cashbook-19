import State from '@/core/ui/State';

class ResponseError extends Error {
  constructor(public response: Response) {
    super();
  }
}

const api = {
  get: (target: string) =>
    fetch(`${process.env.BASE_URL}${target}`, {
      method: 'GET',
      credentials: 'same-origin',
    }),
  post: () => {},
  put: () => {},
  delete: () => {},
};

export const init = async (store: State): Promise<InitResponse | void> => {
  store.update({ loading: true });
  try {
    const response = await api.get('/api/v1/init');
    if (!response.ok) {
      throw new ResponseError(response);
    }
    return (await response.json()) as InitResponse;
  } catch (e) {
    if (e instanceof ResponseError) {
      // 어쩌징 ㅎㅎ
      // 적절한 alert를 호출??
    }
  } finally {
    store.update({ loading: false });
  }
};

export const getRecords = async (store: State): Promise<CashRecord[] | void> => {
  store.update({ loading: true });
  try {
    const state = store.get();

    const response = await api.get(`/api/v1/records?year=${state.date.year}&month=${state.date.month}`);
    if (!response.ok) {
      throw new ResponseError(response);
    }
    const records = (await response.json()) as CashRecord[];

    const categoriesById = state.categories.reduce<Record<number, Category>>((acc, c) => {
      acc[c.id] = c;
      return acc;
    }, {});
    const paymentsById = state.payments.reduce<Record<number, Payment>>((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});
    records.forEach((r) => {
      r.category = categoriesById[r.categoryId];
      r.payment = paymentsById[r.paymentId];
      r.date = new Date(r.date);
    });
    return records;
  } catch (e) {
    if (e instanceof ResponseError) {
      // 어쩌징 ㅎㅎ
      // 적절한 alert를 호출??
    }
  } finally {
    store.update({ loading: false });
  }
};

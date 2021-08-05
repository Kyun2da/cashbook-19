import State from '@/core/ui/state';

class ResponseError extends Error {
  constructor(public response: Response) {
    super();
  }
}

const api = {
  get: (target: string) =>
    fetch(`${process.env.BASE_URL}${target}`, {
      method: 'GET',
      credentials: 'include',
      redirect: 'manual',
    }),
  post: (target: string, data: RequestType) =>
    fetch(`${process.env.BASE_URL}${target}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }),
  put: () => {},
  delete: (target: string) =>
    fetch(`${process.env.BASE_URL}${target}`, {
      method: 'DELETE',
      credentials: 'include',
      redirect: 'manual',
    }),
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

export const logoutExecute = async (store: State): Promise<void> => {
  store.update({ loading: true });
  try {
    const response = await api.get('/auth/logout');
    if (!('location' in response.headers)) {
      window.location.reload();
    }
  } catch (e) {
    // 어쩌징 ㅎㅎ
    // 적절한 alert를 호출??
  } finally {
    store.update({ loading: false });
  }
};

export const enrollRecord = async (store: State, data: NewCashRecordRequest): Promise<void> => {
  store.update({ loading: true });
  try {
    const response = await api.post('/api/v1/records', data);
    if (!response.ok) {
      throw new ResponseError(response);
    }

    const { records, categories, payments } = store.get();
    const newCashRecord = (await response.json()) as CashRecord;
    newCashRecord.category = categories.find((c) => c.id === newCashRecord.categoryId);
    newCashRecord.payment = payments.find((p) => p.id === newCashRecord.paymentId);

    store.update({
      records: [...records, newCashRecord],
    });
  } catch (e) {
    // 어쩌징 ㅎㅎ
    // 적절한 alert를 호출??
  } finally {
    store.update({ loading: false });
  }
};

export const enrollCategory = async (store: State, data: NewCategoryRequest): Promise<Category | void> => {
  store.update({ loading: true });
  try {
    const response = await api.post('/api/v1/categories', data);
    if (!response.ok) {
      throw new ResponseError(response);
    }

    const { categories } = store.get();
    const newCategory = (await response.json()) as Category;
    store.update({
      alert: {
        success: true,
        title: '등록 성공',
        message: '성공적으로 등록을 완료하였습니다.',
      },
      categoryModal: null,
      categories: [...categories, newCategory],
    });
  } catch (e) {
    if (e instanceof ResponseError) {
      const { message } = (await e.response.json()).errors;
      store.update({
        alert: {
          error: true,
          title: '에러 발생',
          message,
        },
        categoryModal: null,
      });
    }
  } finally {
    store.update({ loading: false });
  }
};

export const deleteCategory = async (store: State, categoryId: string): Promise<void> => {
  store.update({ loading: true });
  try {
    const response = await api.delete(`/api/v1/categories/${categoryId}`);
    if (!response.ok) {
      throw new ResponseError(response);
    }

    store.update({
      alert: {
        success: true,
        title: '삭제 성공',
        message: '성공적으로 삭제를 완료하였습니다.',
      },
      categories: store.get().categories.filter((c) => c.id !== categoryId),
    });
  } catch (e) {
    if (e instanceof ResponseError) {
      const { message } = (await e.response.json()).errors;
      store.update({
        alert: {
          error: true,
          title: '에러 발생',
          message,
        },
      });
    }
  } finally {
    store.update({ loading: false });
  }
};

export const enrollPayment = async (store: State, data: NewPaymentRequest): Promise<Payment | void> => {
  store.update({ loading: true });
  try {
    const response = await api.post('/api/v1/payments', data);
    if (!response.ok) {
      throw new ResponseError(response);
    }

    const { payments } = store.get();
    const newPayment = (await response.json()) as Payment;
    store.update({
      alert: {
        success: true,
        title: '등록 성공',
        message: '성공적으로 등록을 완료하였습니다.',
      },
      paymentModal: null,
      payments: [...payments, newPayment],
    });
  } catch (e) {
    if (e instanceof ResponseError) {
      const { message } = (await e.response.json()).errors;
      store.update({
        alert: {
          error: true,
          title: '에러 발생',
          message,
        },
        paymentModal: null,
      });
    }
  } finally {
    store.update({ loading: false });
  }
};

export const deletePayment = async (store: State, paymentId: string): Promise<void> => {
  store.update({ loading: true });
  try {
    const response = await api.delete(`/api/v1/payments/${paymentId}`);
    if (!response.ok) {
      throw new ResponseError(response);
    }

    store.update({
      alert: {
        success: true,
        title: '삭제 성공',
        message: '성공적으로 삭제를 완료하였습니다.',
      },
      categories: store.get().categories.filter((c) => c.id !== paymentId),
    });
  } catch (e) {
    if (e instanceof ResponseError) {
      const { message } = (await e.response.json()).errors;
      store.update({
        alert: {
          error: true,
          title: '에러 발생',
          message,
        },
      });
    }
  } finally {
    store.update({ loading: false });
  }
};

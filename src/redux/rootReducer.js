import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import salesReducer from './slices/salesorder';
import pruchaseReducer from './slices/purchaseorder';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';
import userReducer from './slices/user'; // Import the user slice

// ----------------------------------------------------------------------

export const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key, value) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

export const storage =
  typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

export const salesPersistConfig = {
  key: 'sales',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

export const purchasePersistConfig = {
  key: 'purchase',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  product: persistReducer(productPersistConfig, productReducer),
  salesorder: persistReducer(salesPersistConfig, salesReducer),
  pruchaseorder: persistReducer(purchasePersistConfig, pruchaseReducer),
  user: userReducer, // Add the user reducer
});

export default rootReducer;
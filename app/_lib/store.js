import {configureStore, combineSlices} from '@reduxjs/toolkit';
import {cartSlice} from '@/_lib/slices/cartSlice';

const rootReducer = combineSlices(cartSlice);

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

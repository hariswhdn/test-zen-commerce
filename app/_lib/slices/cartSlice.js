import {createSlice} from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    value: [],
  },
  reducers: {
    setCart: (state, {payload}) => {
      state.value = payload;
    },
  },
  selectors: {
    getCart: (state) => state.value,
  },
});

export const removeFromCart =
  ({product}) =>
  (dispatch, getState) => {
    const tempProduct = JSON.parse(JSON.stringify(product));
    const cart = getCart(getState());
    dispatch(setCart(cart.filter((o) => o.id !== tempProduct.id)));
  };

export const addToCart =
  ({product, type, qty}) =>
  (dispatch, getState) => {
    const tempProduct = JSON.parse(JSON.stringify(product));
    const cart = getCart(getState());
    const idx = cart.findIndex((o) => o.id === tempProduct.id);
    if (idx > -1) {
      dispatch(
        setCart(
          cart.map((o) =>
            o.id === tempProduct.id
              ? {...o, quantity: type === 'change' ? qty : type === 'remove' ? o.quantity - 1 : o.quantity + 1}
              : o
          )
        )
      );
    } else {
      tempProduct.quantity = 1;
      dispatch(setCart([...cart, tempProduct]));
    }
  };

const {actions, reducer, selectors} = cartSlice;
export const {getCart} = selectors;
export const {setCart} = actions;
export default reducer;

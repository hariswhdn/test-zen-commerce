// import {createAppSlice} from '@/lib/createAppSlice';
import {createSlice} from '@reduxjs/toolkit';
// import store from '@/_lib/store';
// import {makeStore} from '@/_lib/store';
// import {useAppDispatch} from '@/_lib/hooks';

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

// export const getCart = () => async (dispatch) => {
//   try {
//     const res = await fetch(`https://dummyjson.com/carts/user/1`);
//     if (!res.ok) return [];
//     const data = await res.json();
//     const products = data?.carts?.[0]?.products || [];
//     if (products.length > 0) {
//       products.map((o) => {
//         o.discountPercentage = Math.round(o.discountPercentage);
//         o.price = Math.round(o.price * 15750);
//         o.discountedPrice = Math.round(o.discountedPrice * 15750);
//         return o;
//       });
//     }
//     await dispatch(setCart(products));
//   } catch (err) {
//     console.error(err);
//   }
// };
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
    // const dispatch = useAppDispatch();
    const tempProduct = JSON.parse(JSON.stringify(product));
    const cart = getCart(getState());
    // const {selectValue} = cartSlice.selectors;
    const idx = cart.findIndex((o) => o.id === tempProduct.id);

    // console.log('asd', cart, idx);
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
      //   // try {
      //   // const res = await fetch(`https://dummyjson.com/products/${id}`);
      //   // if (!res.ok) return false;
      //   // const data = await res.json();
      //   // const product = data || {};
      //   // if (!(Object.keys(product).length > 0)) return false;
      //   // product.discountPercentage = Math.round(product.discountPercentage);
      //   // product.price = Math.round(product.price * 15750);
      //   // product.discountedPrice = Math.round(product.price - (product.price / 100) * product.discountPercentage);
      tempProduct.quantity = 1;
      dispatch(setCart([...cart, tempProduct]));
      //   // } catch (err) {
      //   //   console.error(err);
      // }
    }
  };

const {actions, reducer, selectors} = cartSlice;
export const {getCart} = selectors;
export const {setCart} = actions;
export default reducer;

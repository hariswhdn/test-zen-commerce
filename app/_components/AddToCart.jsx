'use client';

import {useAppDispatch} from '@/_lib/hooks';
import {addToCart} from '@/_lib/slices/cartSlice';

export default function AddToCart({product}) {
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => dispatch(addToCart({product: product}))}
      className="flex justify-center items-center gap-x-2 font-medium w-full px-4 py-3 rounded-[48px] bg-blue-600 text-white"
      type="button">
      <span className="material-icons text-[20px]">add</span>
      <span>Keranjang</span>
    </button>
  );
}

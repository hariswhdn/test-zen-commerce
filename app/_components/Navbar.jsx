'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useAppSelector} from '@/_lib/hooks';
import {getCart} from '@/_lib/slices/cartSlice';
// import {useSelector} from 'react-redux';
// import {useEffect, useState} from 'react';
// import {getCart} from '@/_lib/slices/cartSlice';
// import {useAppDispatch} from '@/_lib/hooks';

export default function Navbar() {
  // const dispatch = useAppDispatch();
  const cart = useAppSelector(getCart);
  // const {cart} = useSelector((state) => state.cart);
  // const [init, setInit] = useState(false);

  // useEffect(() => {
  //   if (!init) {
  //     setInit(true);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (init) {
  //     getCart();
  //     dispatch(getCart());
  //   }
  // }, [init]);

  return (
    <nav className="z-10 bg-white sticky top-0 border-b">
      <section className="flex w-full max-w-[calc(1200px_+_(16px_*_2))] mx-auto py-3.5 px-4 items-center justify-between">
        <Link href="/" className="flex">
          <Image src="/next.svg" width={138} height={28} alt="logo" priority={true} />
        </Link>
        <Link href="/cart" className="relative flex mr-[7px]">
          <span className="material-icons text-[28px]">shopping_cart</span>
          {cart?.length > 0 ? (
            <div className="text-xs font-medium text-white absolute overflow-hidden -top-[7px] -right-[7px] w-5 h-5 flex items-center justify-center rounded-full bg-red-500">
              {cart.map((o) => o.quantity).reduce((a, b) => a + b, 0)}
            </div>
          ) : (
            <></>
          )}
        </Link>
      </section>
    </nav>
  );
}

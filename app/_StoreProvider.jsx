'use client';

import {useRef, useEffect} from 'react';
import {setupListeners} from '@reduxjs/toolkit/query';
import {Provider} from 'react-redux';
import {makeStore} from '@/_lib/store';

export default function StoreProvider({children}) {
  const storeRef = useRef(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (storeRef.current != null) {
      const unsubscribe = setupListeners(storeRef.current.dispatch);
      return unsubscribe;
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}

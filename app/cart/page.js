'use client';

import Image from 'next/image';
import Link from 'next/link';
import stringToCurrency from '@/_lib/stringToCurrency';
import stringToSlug from '@/_lib/stringToSlug';
import stringToCapitalize from '@/_lib/stringToCapitalize';
import {useState, useRef} from 'react';
import {getCart, addToCart, setCart, removeFromCart} from '@/_lib/slices/cartSlice';
import {useAppDispatch, useAppSelector} from '@/_lib/hooks';
import {address} from '@/_lib/constant';
import qris from '@/images/qris.png';
import xendit from '@/images/xendit.png';
import {useRouter} from 'next/navigation';
import Dialog from '@/_components/Dialog';

export default function Cart() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const cart = useAppSelector(getCart);

  const [provinsi, setProvinsi] = useState(0);
  const [kota, setKota] = useState(0);
  const [kecamatan, setKecamatan] = useState(0);
  const [kelurahan, setKelurahan] = useState(0);
  const [payment, setPayment] = useState('xendit');
  const formRef = useRef(null);
  const [dialog, setDialog] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setDialog(true);
    const formData = new FormData(e.target);
    const address_name = formData.get('address');
    const message = `Pembelian:\n${cart
      .map((o) => `${o.quantity}x ${o.title} ${stringToCurrency(Math.round(o.discountedPrice * o.quantity))}`)
      .join('\n')}\n\nPembayaran: ${stringToCapitalize(payment)}\n\nDikirim ke: ${address_name}, ${
      address[provinsi].kota[kota].kecamatan[kecamatan].kelurahan[kelurahan].name
    }, ${address[provinsi].kota[kota].kecamatan[kecamatan].name}, ${address[provinsi].kota[kota].name}, ${
      address[provinsi].name
    }`;
    try {
      await fetch('/api/email', {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          subject: `${name}, Pembelian Berhasil! Berikut Detail Pembeliannya.`,
          message: message,
        }),
      });
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <>
      <title>Keranjang</title>
      {cart.length > 0 ? (
        <>
          <section className="flex flex-col gap-y-6">
            <section className="flex flex-col gap-y-3">
              <p className="font-bold text-xl">Keranjang</p>
              <ul className="flex flex-col gap-y-3">
                {cart.map((o) => (
                  <li
                    key={o.id}
                    className={['flex justify-between border py-3 px-4 rounded', 'max-sm:flex-col max-sm:gap-y-2'].join(
                      ' '
                    )}>
                    <Link href={`/${stringToSlug(o.category)}/${o.id}`}>
                      <section className="flex items-start gap-x-4">
                        <figure className="w-12 border aspect-square rounded overflow-hidden">
                          <Image
                            src={o.thumbnail}
                            width={48}
                            height={48}
                            alt={o.title}
                            priority={true}
                            style={{objectFit: 'cover', aspectRatio: 1 / 1}}
                          />
                        </figure>
                        <section className="flex gap-y-1 flex-col">
                          <p className="font-medium">{stringToCapitalize(o.title)}</p>
                          <p className="text-sm text-slate-500">{o.brand}</p>
                        </section>
                      </section>
                    </Link>
                    <section className="flex items-end justify-end gap-x-4">
                      <section className={['flex gap-x-4', 'max-sm:gap-y-2 max-sm:flex-col'].join(' ')}>
                        {o.quantity > 1 ? (
                          <section className="text-slate-500 gap-y-1 flex items-end flex-col">
                            <p className="font-medium">{stringToCurrency(o.discountedPrice)}</p>
                            <p className="flex text-sm gap-x-1.5">
                              <span className="line-through">{stringToCurrency(o.price)}</span>
                            </p>
                          </section>
                        ) : (
                          <></>
                        )}
                        <section className="gap-y-1 flex items-end flex-col">
                          <p className="font-medium">{stringToCurrency(Math.round(o.discountedPrice * o.quantity))}</p>
                          <p className="flex text-sm gap-x-1.5">
                            <span className="text-slate-500 line-through">
                              {stringToCurrency(Math.round(o.price * o.quantity))}
                            </span>
                            <span className="font-medium text-red-600">{`${o.discountPercentage}%`}</span>
                          </p>
                        </section>
                      </section>
                      <button
                        onClick={() => dispatch(removeFromCart({product: o}))}
                        type="button"
                        className="min-w-7 w-7 h-7 flex bg-red-600 text-white items-center justify-center border border-red-700 rounded">
                        <span className="material-icons text-[16px]">delete</span>
                      </button>
                      <section className="flex flex-col gap-y-1">
                        <p className="text-xs text-slate-500">
                          <span>Stock:&nbsp;</span>
                          <span>{o.stock}</span>
                        </p>
                        <label className="flex items-center">
                          <button
                            disabled={o.quantity === 1}
                            onClick={() => {
                              if (o.quantity > 1) {
                                dispatch(addToCart({type: 'remove', product: o}));
                              }
                            }}
                            type="button"
                            className="w-7 h-7 flex bg-blue-600 text-white items-center justify-center border border-blue-700 rounded-l">
                            <span className="material-icons text-[16px]">remove</span>
                          </button>
                          <input
                            type="number"
                            className="text-sm py-[3px] font-medium px-3 w-[64px] text-center border-y bg-white rounded"
                            placeholder="0"
                            value={o.quantity}
                            onInput={(e) => {
                              const val = parseInt(e.target.value || '1');
                              dispatch(
                                addToCart({
                                  type: 'change',
                                  qty: val < 1 ? 1 : val > o.stock ? o.stock : val,
                                  product: o,
                                })
                              );
                            }}
                            min={1}
                            max={o.stock}
                            spellCheck={false}
                            autoComplete="off"
                          />
                          <button
                            disabled={o.quantity === o.stock}
                            onClick={() => {
                              if (o.quantity < o.stock) {
                                dispatch(addToCart({product: o}));
                              }
                            }}
                            type="button"
                            className="w-7 h-7 flex bg-blue-600 text-white items-center justify-center border border-blue-700 rounded-r">
                            <span className="material-icons text-[16px]">add</span>
                          </button>
                        </label>
                      </section>
                    </section>
                  </li>
                ))}
              </ul>
            </section>
            {address?.length > 0 ? (
              <section className="flex flex-col gap-y-3">
                <p className="font-bold text-xl">Informasi Pribadi</p>
                <form ref={formRef} onSubmit={(e) => onSubmit(e)} className="text-sm grid gap-x-3 grid-cols-6 gap-y-4">
                  <label
                    className={[
                      'flex flex-col gap-y-1.5',
                      'max-xl:col-span-2',
                      'max-md:col-span-3',
                      'max-sm:col-span-6',
                    ].join(' ')}>
                    <p>Provinsi</p>
                    <select
                      className="border rounded py-2 px-3"
                      name="provinsi"
                      required={true}
                      onChange={(e) => setProvinsi(address.findIndex((o) => o.id === parseInt(e.target.value)))}>
                      {address.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label
                    className={[
                      'flex flex-col gap-y-1.5',
                      'max-xl:col-span-2',
                      'max-md:col-span-3',
                      'max-sm:col-span-6',
                    ].join(' ')}>
                    <p>Kota/Kab.</p>
                    <select
                      className="border rounded py-2 px-3"
                      name="kota"
                      required={true}
                      onChange={(e) =>
                        setKota(address[provinsi].kota.findIndex((o) => o.id === parseInt(e.target.value)))
                      }>
                      {address[provinsi].kota.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  {kota > -1 ? (
                    <label
                      className={[
                        'flex flex-col gap-y-1.5',
                        'max-xl:col-span-2',
                        'max-md:col-span-3',
                        'max-sm:col-span-6',
                      ].join(' ')}>
                      <p>Kecamatan</p>
                      <select
                        className="border rounded py-2 px-3"
                        name="kecamatan"
                        required={true}
                        onChange={(e) =>
                          setKecamatan(
                            address[provinsi].kota[kota].kecamatan.findIndex((o) => o.id === parseInt(e.target.value))
                          )
                        }>
                        {address[provinsi].kota[kota].kecamatan.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <></>
                  )}
                  {kecamatan > -1 ? (
                    <label
                      className={[
                        'flex flex-col gap-y-1.5',
                        'max-xl:col-span-2',
                        'max-md:col-span-3',
                        'max-sm:col-span-6',
                      ].join(' ')}>
                      <p>Kelurahan/Desa</p>
                      <select
                        className="border rounded py-2 px-3"
                        name="kelurahan"
                        required={true}
                        onChange={(e) =>
                          setKelurahan(
                            address[provinsi].kota[kota].kecamatan[kecamatan].kelurahan.findIndex(
                              (o) => o.id === parseInt(e.target.value)
                            )
                          )
                        }>
                        {address[provinsi].kota[kota].kecamatan[kecamatan].kelurahan.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <></>
                  )}
                  <label
                    className={[
                      'flex flex-col col-span-2 gap-y-1.5',
                      'max-xl:col-span-4',
                      'max-md:col-span-6',
                      'max-sm:col-span-6',
                    ].join(' ')}>
                    <p>Nama Jalan, No. Bangunan, RT/RW</p>
                    <textarea
                      className="border rounded resize-none py-2 px-3"
                      name="address"
                      placeholder="Nama Jalan, No. Bangunan, RT/RW"
                      spellCheck={false}
                      autoComplete="off"
                      rows={1}
                      required={true}></textarea>
                  </label>
                  <label
                    className={['flex flex-col col-span-2 gap-y-1.5', 'max-md:col-span-3', 'max-sm:col-span-6'].join(
                      ' '
                    )}>
                    <p>Nama Lengkap</p>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border rounded py-2 px-3"
                      name="name"
                      placeholder="Nama Lengkap"
                      spellCheck={false}
                      autoComplete="off"
                      required={true}
                    />
                  </label>
                  <label
                    className={['flex flex-col col-span-2 gap-y-1.5', 'max-md:col-span-3', 'max-sm:col-span-6'].join(
                      ' '
                    )}>
                    <p>
                      Email&nbsp;<span className="text-xs text-slate-500">(Kirim bukti pembayaran)</span>
                    </p>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border rounded py-2 px-3"
                      name="email"
                      placeholder="Email"
                      spellCheck={false}
                      autoComplete="off"
                      required={true}
                    />
                  </label>
                </form>
              </section>
            ) : (
              <></>
            )}
            <section className="flex flex-col gap-y-3">
              <p className="font-bold text-xl">Pembayaran</p>
              <section className="flex gap-x-2 items-start">
                <label
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.code) {
                      setPayment('xendit');
                    }
                  }}
                  className={[
                    'flex p-1.5 px-3 border-2 rounded overflow-hidden cursor-pointer',
                    payment === 'xendit' ? 'border-blue-500' : 'border-transparent',
                  ].join(' ')}>
                  <input
                    className="hidden"
                    type="radio"
                    name="payment"
                    checked={payment === 'xendit'}
                    onChange={(e) => setPayment(e.target.value)}
                    value="xendit"
                    required
                  />
                  <Image src={xendit} width={125} height={36} priority={true} alt="Xendit" />
                </label>
                <label
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.code) {
                      setPayment('qris');
                    }
                  }}
                  className={[
                    'flex p-1.5 px-3 border-2 rounded overflow-hidden cursor-pointer',
                    payment === 'qris' ? 'border-blue-500' : 'border-transparent',
                  ].join(' ')}>
                  <input
                    className="hidden"
                    type="radio"
                    name="payment"
                    checked={payment === 'qris'}
                    onChange={(e) => setPayment(e.target.value)}
                    value="qris"
                    required
                  />
                  <Image src={qris} width={220} height={36} priority={true} alt="QRIS" />
                </label>
              </section>
              <section className="flex flex-col gap-y-4 items-center"></section>
            </section>
          </section>
          <section
            className={[
              'flex gap-x-4 ml-auto mt-auto items-center',
              'max-sm:ml-[unset] max-sm:flex-col max-sm:gap-y-4',
            ].join(' ')}>
            <p className="gap-y-1 flex items-end flex-col">
              <span className="font-medium">
                {stringToCurrency(
                  cart.map((o) => Math.round(o.discountedPrice * o.quantity)).reduce((a, b) => a + b, 0)
                )}
              </span>
              <span className="text-slate-500 text-sm line-through">
                {stringToCurrency(cart.map((o) => Math.round(o.price * o.quantity)).reduce((a, b) => a + b, 0))}
              </span>
            </p>
            <button
              type="button"
              onClick={() => formRef.current.requestSubmit()}
              className="flex items-center justify-center px-5 py-3 rounded-[48px] gap-x-2 bg-blue-600 text-white font-medium">
              <span className="material-icons text-[20px]">check</span>
              <p>Selesaikan Pembayaran</p>
            </button>
          </section>
        </>
      ) : (
        <p className="text-center font-medium">Silakan berbelanja</p>
      )}
      {dialog ? (
        <Dialog
          name={name}
          email={email}
          onClick={() => {
            setDialog(false);
            dispatch(setCart([]));
            router.replace('/');
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
}

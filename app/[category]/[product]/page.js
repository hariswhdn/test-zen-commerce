import {notFound} from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AddToCart from '@/_components/AddToCart';
import {getProducts, getProduct} from '@/_lib/api';
import stringToCurrency from '@/_lib/stringToCurrency';
import stringToSlug from '@/_lib/stringToSlug';
import stringToCapitalize from '@/_lib/stringToCapitalize';

export const generateStaticParams = async () => {
  const products = await getProducts({});
  if (!(products.length > 0)) return [];

  return products.map((o) => ({
    product: o.id.toString(),
  }));
};

export default async function ProductPage({params: {product}}) {
  const item = await getProduct(product);
  if (!(Object.keys(item).length > 0)) notFound();

  return (
    <section className={['flex gap-x-8 items-start', 'max-xl:gap-6', 'max-md:flex-col'].join(' ')}>
      <figure
        className={[
          'relative w-[320px] border aspect-square rounded overflow-hidden',
          'max-lg:w-[200px]',
          'max-md:w-full',
        ].join(' ')}>
        <Image
          src={item.thumbnail}
          alt={item.title}
          width={733}
          height={733}
          priority={true}
          style={{objectFit: 'cover', aspectRatio: 1 / 1}}
        />
      </figure>
      <article
        className={[
          'border rounded p-4 flex flex-col gap-y-1 w-[calc(100%_-_320px_-_288px_-_(32px_*_2))]',
          'max-xl:w-[calc(100%_-_320px_-_240px_-_(24px_*_2))]',
          'max-lg:w-[calc(100%_-_200px_-_200px_-_(24px_*_2))] max-lg:border-0 max-lg:p-0',
          'max-md:w-full',
        ].join(' ')}>
        <p className="font-bold text-xl">{stringToCapitalize(item.title)}</p>
        <p className="flex gap-x-0.5 items-center">
          <span className="material-icons text-[20px] text-yellow-500">star</span>
          <span>{item.rating.toFixed(1)}</span>
        </p>
        <section className="my-2 flex flex-col">
          <p className="text-3xl font-bold">{stringToCurrency(item.discountedPrice)}</p>
          <p className="flex gap-x-1.5">
            <span className="text-slate-500 line-through">{stringToCurrency(item.price)}</span>
            <span className="font-medium text-red-600">{`${item.discountPercentage}%`}</span>
          </p>
        </section>
        <p>
          <span className="text-slate-500">Merk:&nbsp;</span>
          {item.brand}
        </p>
        <p>
          <span className="text-slate-500">Kategori:&nbsp;</span>
          <Link className="text-blue-700 font-medium" href={`/${stringToSlug(item.category)}`}>
            {stringToCapitalize(item.category)}
          </Link>
        </p>
        <p>
          <span className="text-slate-500">Deskripsi:&nbsp;</span>
          {item.description}
        </p>
      </article>
      <aside
        className={[
          'w-[288px] flex flex-col gap-y-3 border p-4 rounded',
          'max-xl:w-[240px]',
          'max-lg:w-[200px] max-lg:p-0 max-lg:border-0',
          'max-md:w-full',
        ].join(' ')}>
        <p>
          <span className="text-slate-500">Stock:&nbsp;</span>
          <span className="font-medium">{item.stock}</span>
        </p>
        <AddToCart product={item} />
      </aside>
    </section>
  );
}

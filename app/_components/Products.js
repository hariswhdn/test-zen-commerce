import Link from 'next/link';
import Image from 'next/image';
import {getProducts} from '@/_lib/api';
import stringToCurrency from '@/_lib/stringToCurrency';
import stringToSlug from '@/_lib/stringToSlug';
import {notFound} from 'next/navigation';
import stringToCapitalize from '@/_lib/stringToCapitalize';

export default async function Products({category = ''}) {
  const products = await getProducts({category: category});
  if (!(products?.length > 0)) notFound();

  return (
    <section
      className={[
        'grid grid-cols-7 gap-4',
        'max-xl:grid-cols-6',
        'max-lg:grid-cols-5',
        'max-md:grid-cols-4',
        'max-sm:grid-cols-2',
      ].join(' ')}>
      {products.map((o) => (
        <Link key={o.id} href={`/${stringToSlug(o.category)}/${o.id}`}>
          <article className="border items-start rounded flex flex-col">
            <figure className="w-full aspect-square rounded-t relative overflow-hidden">
              <Image
                src={o.thumbnail}
                alt={o.title}
                width={294}
                height={294}
                priority={true}
                style={{objectFit: 'cover', aspectRatio: 1 / 1}}
              />
            </figure>
            <section className="flex flex-col p-2 gap-y-0.5">
              <p className="text-sm line-clamp-2">{stringToCapitalize(o.title)}</p>
              <p className="font-medium">{stringToCurrency(o.discountedPrice)}</p>
              <p className="flex text-xs gap-x-1.5">
                <span className="text-slate-500 line-through">{stringToCurrency(o.price)}</span>
                <span className="font-medium text-red-600">{`${o.discountPercentage}%`}</span>
              </p>
              <p className="flex text-xs gap-x-0.5">
                <span className="material-icons text-[16px] text-yellow-500">star</span>
                <span className="text-slate-500">{o.rating.toFixed(1)}</span>
              </p>
            </section>
          </article>
        </Link>
      ))}
    </section>
  );
}

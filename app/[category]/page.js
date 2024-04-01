import {getProducts} from '@/_lib/api';
import Products from '@/_components/Products';
import stringToCapitalize from '@/_lib/stringToCapitalize';
import stringToSlug from '@/_lib/stringToSlug';

export const generateStaticParams = async () => {
  const products = await getProducts({});
  if (!(products.length > 0)) return [];

  return products.map((o) => ({
    category: stringToSlug(o.category),
  }));
};

export default async function CategoryPage({params: {category}}) {
  return (
    <>
      <p className="font-bold text-xl">{stringToCapitalize(category)}</p>
      <Products category={category} />
    </>
  );
}

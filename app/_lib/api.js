export async function getProducts({category = ''}) {
  let products = [];
  try {
    const url = `https://${process.env.API_URL}/products${category ? `/category/${category}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    products = data?.products || [];
    products.map((o) => {
      o.discountPercentage = Math.round(o.discountPercentage);
      o.price = Math.round(o.price * 15750);
      o.discountedPrice = Math.round(o.price - (o.price / 100) * o.discountPercentage);
      return o;
    });
    if (products.length > 21) {
      products.length = 21;
    }
  } catch (err) {
    throw new Error(err);
  }
  return products;
}

export async function getProduct(id) {
  let product = {};
  try {
    const res = await fetch(`https://${process.env.API_URL}/products/${id}`);
    if (!res.ok) return {};
    const data = await res.json();
    product = data || {};
    product.discountPercentage = Math.round(product.discountPercentage);
    product.price = Math.round(product.price * 15750);
    product.discountedPrice = Math.round(product.price - (product.price / 100) * product.discountPercentage);
  } catch (err) {
    throw new Error(err);
  }
  return product;
}

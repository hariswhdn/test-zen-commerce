export async function getProducts({category = ''}) {
  let products = [];
  try {
    const url = `https://dummyjson.com/products${category ? `/category/${category}` : ''}`;
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
    const res = await fetch(`https://dummyjson.com/products/${id}`);
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

// export async function getCart() {
//   let cart = {};
//   try {
//     const res = await fetch(`https://dummyjson.com/carts/user/1`);
//     if (!res.ok) return {};
//     const data = await res.json();
//     cart = data?.carts?.[0] || {};
//     if (Object.keys(cart).length > 0 && cart?.products?.length > 0) {
//       cart.products.map((o) => {
//         o.discountPercentage = Math.round(o.discountPercentage);
//         o.price = Math.round(o.price * 15750);
//         o.discountedPrice = Math.round(o.price - (o.price / 100) * o.discountPercentage);
//         return o;
//       });
//     }
//   } catch (err) {
//     throw new Error(err);
//   }
//   return cart;
// }

// export async function addToCart(id) {
//   let cart = {};
//   try {
//     const res = await fetch(`https://dummyjson.com/carts/8`, {
//       method: 'PUT',
//       headers: {'Content-Type': 'application/json'},
//       body: JSON.stringify({
//         merge: true,
//         products: [
//           {
//             id: id,
//             quantity: 1,
//           },
//         ],
//       }),
//     });
//     if (!res.ok) return {};
//     const data = await res.json();
//     cart = data?.carts?.[0] || {};
//     if (Object.keys(cart).length > 0 && cart?.products?.length > 0) {
//       cart.products.map((o) => {
//         o.discountPercentage = Math.round(o.discountPercentage);
//         o.price = Math.round(o.price * 15750);
//         o.discountedPrice = Math.round(o.price - (o.price / 100) * o.discountPercentage);
//         return o;
//       });
//     }
//     if (cart.length > 21) {
//       cart.length = 21;
//     }
//   } catch (err) {
//     throw new Error(err);
//   }
//   return cart;
// }

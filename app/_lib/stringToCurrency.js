export default function stringToCurrency(text) {
  return `Rp${new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
  }).format(text)}`;
}

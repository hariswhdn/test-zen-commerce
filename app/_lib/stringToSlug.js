export default function stringToSlug(text) {
  return decodeURI(text)
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replaceAll(' ', '-')
    .toLowerCase();
}

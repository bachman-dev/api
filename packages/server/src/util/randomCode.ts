export default function randomCode(length: number): string {
  const VALID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let array = new Uint8Array(length);
  crypto.getRandomValues(array);
  array = array.map((item) => VALID_CHARS.charCodeAt(item % VALID_CHARS.length));
  return String.fromCharCode.apply(null, Array.from(array));
}

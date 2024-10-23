export default function randomCode(length: number): string {
  const VALID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  const charArray: number[] = [];
  array.forEach((item) => charArray.push(VALID_CHARS.charCodeAt(item % VALID_CHARS.length)));
  const code = String.fromCharCode.apply(null, charArray);
  return code;
}

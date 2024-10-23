export default async function verifiedCode(codeVerifier: string): Promise<string> {
  const digest = await crypto.subtle.digest({ name: "SHA-256" }, new TextEncoder().encode(codeVerifier));
  return btoa(String.fromCharCode(...Array.from(new Uint8Array(digest))))
    .replace("+", "-")
    .replace("/", "_")
    .replace("=", "");
}

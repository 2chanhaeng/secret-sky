export const bufToB64 = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/\=/g, "");
export const b64ToBuf = (base64: string) =>
  Uint8Array.from([
    ...atob(base64.replace(/-/g, "+").replace(/_/g, "/")),
  ].map((c) => c.charCodeAt(0)));

export function parseCookies(cookies: string) {
  return cookies
    .split(";")
    .map((v: string) => v.split("="))
    .reduce((acc: { [key: string]: string }, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
}

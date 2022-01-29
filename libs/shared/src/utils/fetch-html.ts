import axios from "axios";
import cheerio from "cheerio";

export async function fetchHtml(url: string, headers?: Record<string, string>) {
  const { data } = await axios.get(url, {
    headers,
    withCredentials: true,
  });
  return cheerio.load(data);
}

export function filterByInclusion<T>(
  objects: T[],
  keys: (keyof T)[],
  includes: string[]
): T[] {
  return objects.filter((p) => {
    for (const include of includes) {
      const stringToSearch = keys.reduce(
        (acc, curr) => acc + String(p[curr]),
        ""
      );
      if (stringToSearch.toLowerCase().includes(include)) return true;
    }
  });
}

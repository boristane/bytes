export default function buildUrl(url: string, params: any): string {
  let queryString = Object.keys(params).reduce((acc, key) => {
    return (
      acc + `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}&`
    );
  }, "");
  if (queryString.length > 0) {
    queryString = queryString.substring(0, queryString.length - 1);
  }
  return `${url}?${queryString}`;
}

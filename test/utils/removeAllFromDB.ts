import * as pg from "pg";

export default function removeAllFromDB(
  client: pg.Client
): Promise<pg.QueryResult[]> {
  const tables = [
    "public.byte",
    "public.byte_tags_tag",
    "public.tag",
    "public.user"
  ];
  const promises = tables.map(async table => {
    const query = {
      name: `delete-${table}`,
      text: `DELETE FROM ${table}`
    };
    return client.query(query);
  });
  return Promise.all(promises);
}

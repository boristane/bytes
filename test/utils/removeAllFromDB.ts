import * as pg from "pg";

export default async function removeAllFromDB() {
  const tables = [
    "public.byte",
    "public.byte_tags_tag",
    "public.tag",
    "public.user"
  ];
  const client = new pg.Client();
  await client.connect();

  const promises = tables.map(async table => {
    const query = {
      name: `delete-${table}`,
      text: `DELETE FROM ${table}`
    };
    return client.query(query);
  });
  return Promise.all(promises);
}

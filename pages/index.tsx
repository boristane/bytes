import Layout from "../components/Layout";
import ByteLink from "../components/ByteLink";
import React, { useEffect } from "react";
import { getByteList } from "../src/api";
import PageSelector from "../components/PageSelector";
import Error from "next/error";

export default function Index(props) {
  useEffect(() => {
    document.title = `page: ${props.page}`;
  });
  if (props.err) return <Error statusCode={404} />;
  return (
    <Layout>
      <ul>
        {props.bytes.map(byte => {
          return (
            <li key={byte.id.toString()}>
              <ByteLink {...byte} />
            </li>
          );
        })}
      </ul>
      <PageSelector currentPage={props.page} />
    </Layout>
  );
}

Index.getInitialProps = async function(props) {
  let { page } = props.query;
  page = page ? page : 1;
  return await getByteList(page);
};

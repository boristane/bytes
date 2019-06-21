import Layout from "../components/Layout";
import React, { useEffect, useState } from "react";
import { getByte, loadFile, deleteByte } from "../src/api";
import { Markdown } from "react-showdown";
import Link from "next/link";
import Router from "next/router";
import Error from "next/error";

const layoutStyle = {
  maxWidth: 650,
  margin: "auto"
};

const Content = props => {
  const [markdown, setMarkdown] = useState("");
  const [token, setToken] = useState("");
  async function handleDelete(e) {
    e.preventDefault();
    const a = await deleteByte(props.byte.id, token);
    Router.push("/");
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await loadFile(props.byte.body);
      setMarkdown(result.data);
    };

    fetchData();
    const b = localStorage.getItem("token");
    setToken(b ? b : "");
  }, []);

  useEffect(() => {
    document.title = `${props.byte.title}`;
  });

  const date = new Date(props.byte.created);
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  return (
    <Layout>
      <div style={layoutStyle}>
        <h1 style={{ marginBottom: 25 }}>
          <Link href={`/post?id=${props.byte.id}`} as={`/b/${props.byte.id}`}>
            <a style={{ fontSize: 20, lineHeight: 1.8 }}>{props.byte.title}</a>
          </Link>
          <div>
            <span style={{ color: "grey" }}>
              {date.toLocaleDateString("en-US", dateOptions)}
            </span>
            <a onClick={handleDelete} style={{ marginLeft: 15 }} href="/">
              {token === "" ? "" : "(delete)"}
            </a>
          </div>
        </h1>
        <img src={props.byte.image} className="header-image" />
        <div className="body">
          <Markdown markup={markdown} />
        </div>
      </div>
      <style>
        {`
          .header-image {
            object-fit: cover;
            width: 100%;
            height: 300px;
          }
        
        pre { 
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 2px;
          overflow-x: auto;
          border: 0.5px solid rgb(253, 101, 101)
        }

        h1 {
          font-weight: normal;
          margin-top: 40px;
          font-size: 16px
        }
        
        h2, h3, h4 {
          font-weight: normal;
          margin-top: 40px;
          font-size: 16px
        }
        
        .body h1 {
          display: none
        }
        
        .language-bash,
        .language-js,
        .language-ts {
            color: #070707;
          font-family: monospace !important;
        }    
        
        strong {
          font-weight: 600;
          color: #444;
        }
        
        ol {
          padding-left: 1.6em;
        }
        
        ul {
          padding-left: 15px;
          list-style-type: none;
        }
        
        p img {
          width: 100%;
        }
        
        p, ol,
        p, ul {
          line-height: 25px;
        }
        
        em {
          color: grey;
        }
        @media only screen and (max-width: 600px) {
          h1 {
            font-size: 20px
          }
          h2, h3, h4 {
            font-size: 18px
          }
        }
        `}
      </style>
    </Layout>
  );
};

export default function Post(props) {
  if (props.err) return <Error statusCode={404} />;
  return <Content byte={props.byte} />;
}

Post.getInitialProps = async function(props) {
  const { id } = props.query;
  return await getByte(id);
};

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
        <div className="body" style={{ color: "black" }}>
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
          background-color: #f7f7f7;
          padding: 15px;
          border-radius: 2px;
          overflow-x: auto;
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
          font-family: Courier, monospace, sans-serif !important;
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
        /*change the thinkness of the scrollbar here*/
        ::-webkit-scrollbar {
          width: 2px;
          height: 2px;
          -webkit-box-shadow: inset 0 0 1px rgba(0,0,0,0); 
          -webkit-border-radius: 1px;
          border-radius: 1px;
        }
        ::-webkit-scrollbar:hover {
          width: 5px;
          height: 5px;
          border-radius: 3px;
        }
        /*add a shadow to the scrollbar here*/
        ::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 1px rgba(0,0,0,0); 
            -webkit-border-radius: 1px;
            border-radius: 1px;
        }
        /*this is the little scrolly dealio in the bar*/ 
        ::-webkit-scrollbar-thumb {
            border-radius: 1px;
            background: rgb(253, 101, 101);
            height: 3px;
        }
        /*nobody needs this little scrollbar corner, I mean really, get rid of it haha*/  
          ::-webkit-scrollbar-corner       { display: none; height: 0px; width: 0px; }
       
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

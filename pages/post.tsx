import Layout from "../components/Layout";
import React, { useEffect, useState } from "react";
import { getByte, loadFile, deleteByte } from "../src/api";
import { Markdown } from "react-showdown";
import Link from "next/link";
import Router from "next/router";
import Error from "next/error";
import { NextSeo, BlogJsonLd } from "next-seo";

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
    <>
      <NextSeo
        title={`${props.byte.title}`}
        description="Bytes are a series of small blog posts by Boris Tane."
        openGraph={{
          url: `https://bytes.boristane.com/b/${props.id}`,
          title: `${props.byte.title}`,
          description: "Bytes are a series of small blog posts by Boris Tane.",
          type: "article",
          article: {
            publishedTime: props.byte.created,
            modifiedTime: props.byte.updated,
            section: "Software Engineering",
            authors: ["https://www.boristane.com"],
            tags: props.byte.tags
          },
          images: [
            {
              url: props.byte.image,
              alt: `${props.byte.title}`
            }
          ],
          site_name: "Bytes by Boris Tane"
        }}
        twitter={{
          handle: "@BorisTane",
          site: "@BorisTane",
          cardType: "summary"
        }}
      />
      <BlogJsonLd
        url={`https://bytes.boristane.com/b/${props.id}`}
        title={`${props.byte.title}`}
        images={[props.byte.image]}
        datePublished={props.byte.created}
        dateModified={props.byte.updated}
        authorName="Boris Tane"
        description="Bytes are a series of small blog posts by Boris Tane."
      />
      <Layout>
        <div style={layoutStyle}>
          <h1 style={{ marginBottom: 25 }}>
            <Link href={`/post?id=${props.byte.id}`} as={`/b/${props.byte.id}`}>
              <a style={{ fontSize: 20, lineHeight: 1.8 }}>{props.byte.title}</a>
            </Link>
            <div>
              <span style={{ color: "grey" }}>{date.toLocaleDateString("en-US", dateOptions)}</span>
              <a onClick={handleDelete} style={{ marginLeft: 15 }} href="/">
                {token === "" ? "" : "(delete)"}
              </a>
            </div>
          </h1>
          <img src={props.byte.image} className="header-image" />
          <div className="body" style={{ color: "#444" }}>
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
          font-size: 16px;
        }
        
        h2, h3, h4 {
          font-weight: normal;
          margin-top: 40px;
          font-size: 22px;
          padding-left: 15px;
          border-left: 5px solid rgb(253, 101, 101)
        }
        
        .body h1 {
          display: none
        }
        
        .language-bash,
        .language-js,
        .language-ts {
          font-family: 'Ubuntu Mono', monospace;
        } 

        blockquote {
          width: 100%;
          margin: 0;
          text-align: center;
          padding-top: 20px;
          padding-bottom: 20px;
          color: black;
          font-style: italic;
          font-size: 16px;
        }
        
        strong {
          font-weight: 600;
          color: #444;
        }
        
        ol {
          margin-left: 25px;
        }
        
        ul {
          margin-left: 25px;
        }
        
        p img {
          width: 100%;
        }
        
        p {
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
    </>
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

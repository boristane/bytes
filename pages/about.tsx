import Layout from "../components/Layout";
import React, { useEffect } from "react";
import { NextSeo } from "next-seo";

const style = {
  marginLeft: 30,
  maxWidth: 650
};

export default function About() {
  useEffect(() => {
    document.title = `about`;
  });
  return (
    <>
      <NextSeo
        title="About - Bytes by Boris Tane"
        description="Bytes are a series of small blog posts by Boris Tane."
        openGraph={{
          url: "https://bytes.boristane.com/about",
          title: "About - Bytes by Boris Tane",
          description: "Bytes are a series of small blog posts by Boris Tane.",
          images: [
            {
              url: "https://boristane-projects-data.s3.eu-west-2.amazonaws.com/bytes.png",
              width: 500,
              height: 500,
              alt: "Bytes"
            }
          ],
          site_name: "Bytes by Boris Tane"
        }}
        twitter={{
          handle: "@BorisTane"
        }}
      />
      <Layout {...{ isIndex: true }}>
        <div style={style}>
          <p>
            <span style={{ textDecoration: "underline" }}>byte</span>: a unit of digital information
            that most commonly consists of eight bits, representing a binary number. <br />
            The byte [...] is the smallest addressable unit of memory in many computer architectures
            [<a href="https://en.wikipedia.org/wiki/Byte">source</a>].
          </p>
          <p>
            This is thus a collection of (in)frequent{" "}
            <span style={{ fontStyle: "italic" }}>byte-sized</span> posts on software development,
            architecture and whatever else I feel like writing.
          </p>
        </div>
      </Layout>
    </>
  );
}

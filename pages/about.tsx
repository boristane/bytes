import Layout from "../components/Layout";
import React, { useEffect } from "react";

const style = {
  marginLeft: 30,
  maxWidth: 650
};

export default function About() {
  useEffect(() => {
    document.title = `about`;
  });
  return (
    <Layout>
      <div style={style}>
        <p>
          <span style={{ textDecoration: "underline" }}>byte</span>: a unit of
          digital information that most commonly consists of eight bits,
          representing a binary number. <br />
          The byte [...] is the smallest addressable unit of memory in many
          computer architectures [
          <a href="https://en.wikipedia.org/wiki/Byte">source</a>].
        </p>
        <p>
          This is thus a collection of (in)frequent{" "}
          <span style={{ fontStyle: "italic" }}>byte-sized</span> posts on
          software development, architecture and whatever else I feel like
          writing.
        </p>
      </div>
    </Layout>
  );
}

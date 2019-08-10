import React, { CSSProperties } from "react";
import feather from "feather-icons";

export default function Footer(props) {
  const { isIndex } = props;
  const linkStyle = {
    marginRight: 15,
    width: 2,
    height: 2,
    color: "lightgray"
  };
  const footerStyle = {
    position: isIndex ? "fixed" : "static"
  } as CSSProperties;
  return (
    <div className="footer" style={footerStyle}>
      <span>
        <a
          className="footer-link"
          style={linkStyle}
          href="mailto:me@boristane.com"
          dangerouslySetInnerHTML={{ __html: feather.icons.mail.toSvg({ width: 15 }) }}
        ></a>
        <a
          className="footer-link"
          style={linkStyle}
          href="https://twitter.com/BorisTane"
          dangerouslySetInnerHTML={{ __html: feather.icons.twitter.toSvg({ width: 15 }) }}
        ></a>
        <a
          className="footer-link"
          style={linkStyle}
          href="https://www.linkedin.com/in/boristane/"
          dangerouslySetInnerHTML={{ __html: feather.icons.linkedin.toSvg({ width: 15 }) }}
        ></a>
        <a
          className="footer-link"
          style={linkStyle}
          href="https://github.com/boristane"
          dangerouslySetInnerHTML={{ __html: feather.icons.github.toSvg({ width: 15 }) }}
        ></a>
      </span>
      <style>
        {`
        .footer {
          bottom: 10px;
          left: 0;
          margin-top: 50px;
          text-align: center;
          background-color: white;
          width: 100%;
        }
        .footer-link:hover {
          color: red !important;
          background: white !important;
        }
        `}
      </style>
    </div>
  );
}

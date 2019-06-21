import Link from "next/link";
import React from "react";

const dateLayout = {
  display: "inline-block",
  textAlign: "right" as "right",
  color: "grey"
};

const titleLayout = {
  display: "inline-block"
};

export default function ByteLink(props) {
  const date = new Date(props.created);
  const dateOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  return (
    <div className="byte-link">
      <div style={dateLayout} className="date-div">
        <span>{date.toLocaleDateString("en-US", dateOptions)}</span>
      </div>
      <div style={titleLayout}>
        <Link href={`/post?id=${props.id}`} as={`/b/${props.id}`}>
          <a>{props.title}</a>
        </Link>
      </div>
      <style>
        {`
          .byte-link {
            height: 20px
          }
          .date-div{
            width: 150px;
            margin-right: 40px;
          }
          @media only screen and (max-width: 600px) {
            .date-div {
              width: 20%;
              font-size: 10px !important;
              margin-right: 10px;
            }
          }
          `}
      </style>
    </div>
  );
}

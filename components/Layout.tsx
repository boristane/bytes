import Header from "./Header";
import React from "react";
import Footer from "./Footer";

export default function Layout(props) {
  return (
    <div>
      <div className="main">
        <Header />
        {props.children}
        <Footer {...props} />
        <style>
          {`
          body {
            padding-top: 50px;
            font: 15px Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace,serif;
            color: #444
          }
          ul {
            padding: 0;
          }

          li {
            list-style: none;
            margin: 5px 0;
          }

          a {
            text-decoration: none;
            color: rgb(253, 101, 101);
            transition: all 0.2s ease-in-out;
          }

          a:hover {
            color: white;
            background: rgb(253, 101, 101)
          }

          @media only screen and (max-width: 600px) {
            body {
              font-size: 15px;
            }
          }
        `}
        </style>
      </div>
      <style>
        {`
        .main {
          padding: 20px 50px 10px 50px;
        }
        @media only screen and (max-width: 600px) {
          .main {
            padding: 20px 20px 10px 20px;
          }
        }
        `}
      </style>
    </div>
  );
}

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getNumPage } from "../src/api";

const linkStyle = {
  marginLeft: 15
};

const letters = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve"
];

export default function PageSelector(props) {
  const [pagesArray, setPagesArray] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const numPages = await getNumPage();
      const arr = [];
      for (let i = 0; i < numPages; i += 1) {
        arr.push(letters[i]);
      }
      setPagesArray(arr);
    };

    fetchData();
  }, []);
  return (
    <div style={{ marginTop: 50, color: "grey" }}>
      <span>page: </span>
      <span>
        {pagesArray.map((page, index) => {
          return (
            <Link key={index} href={`/?page=${index + 1}`} as={`/p/${page}`}>
              <a
                style={{
                  ...linkStyle,
                  textDecoration:
                    props.currentPage == index + 1 ? "underline" : ""
                }}
              >
                {page}
              </a>
            </Link>
          );
        })}
      </span>
    </div>
  );
}

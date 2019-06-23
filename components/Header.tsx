import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getUser } from "../src/api";
import Router from "next/router";

const linkStyle = {
  marginRight: 15
};

function handleLogout(e) {
  e.preventDefault();
  localStorage.clear();
  Router.push("/");
}

export default function Header() {
  const [user, setUser] = useState({ name: "" });
  useEffect(() => {
    const id = parseInt(localStorage.getItem("id"), 10);
    async function fetchData() {
      if (id) {
        const res = await getUser(id);
        setUser(res.user);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="header">
      <span style={linkStyle}>
        <Link href="/">
          <a>bytes</a>
        </Link>
        <span> </span>(<a href="https://github.com/boristane/bytes">src</a>)
      </span>
      <Link href="/about">
        <a style={linkStyle}>about</a>
      </Link>
      <Link href="/new">
        <a style={linkStyle}>{user.name}</a>
      </Link>
      <a style={linkStyle} href="" onClick={handleLogout}>
        {user.name ? "logout" : ""}
      </a>
      <style>
        {`
          .header {
            position: fixed;
            top: 0px;
            left: 0px;
            padding: 20px 50px;
            background-color: white;
            width: 100%;
            border-bottom: 1px solid #f1f1f1
          }
          `}
      </style>
    </div>
  );
}

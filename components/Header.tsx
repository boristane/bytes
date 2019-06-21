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
    const email = localStorage.getItem("email");
    async function fetchData() {
      if (email) {
        const res = await getUser(email);
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
            margin-bottom: 50px
          }
          `}
      </style>
    </div>
  );
}

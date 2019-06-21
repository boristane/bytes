import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import { signup } from "../src/api";
import Router from "next/router";

const layout = {
  margin: 10
};

const textFieldStyle = {
  borderRadius: 5,
  border: "1px solid grey",
  padding: 20,
  width: 200,
  height: 0.5
};

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    const { data, err } = await signup(name, email, password);
    if (err) {
      return setMessage("Signup failed.");
    }
    Router.push("/login");
  };

  useEffect(() => {
    document.title = `$new user`;
  });
  return (
    <Layout>
      <div>
        <form onSubmit={handleSubmit}>
          <div style={layout}>
            <input
              style={textFieldStyle}
              type="text"
              value={name}
              onChange={(e: any) => setName(e.target.value)}
              required
              placeholder="name"
            />
          </div>
          <div style={layout}>
            <input
              style={textFieldStyle}
              type="text"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
              placeholder="email"
            />
          </div>
          <div style={layout}>
            <input
              style={textFieldStyle}
              type="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
              placeholder="password"
            />
          </div>
          <input style={layout} type="submit" value="Submit" />
        </form>
        <div style={{ color: "red" }}>{message}</div>
      </div>
    </Layout>
  );
}

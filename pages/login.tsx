import Layout from "../components/Layout";
import React, { useEffect, useState } from "react";
import instance, { login } from "../src/api";
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

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    const { token } = await login(email, password);
    if (!token) {
      return setMessage("Authentication failed.");
    }
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    Router.push("/");
  };

  useEffect(() => {
    document.title = `login`;
  });
  return (
    <Layout>
      <div>
        <form onSubmit={handleSubmit}>
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

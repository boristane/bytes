import Layout from "../components/Layout";
import React, { useEffect, useState } from "react";
import Axios from "axios";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const { URL: url } = publicRuntimeConfig;

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

export default function New(props) {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState();
  const [body, setBody] = useState();
  const [loaded, setLoaded] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = `new byte`;
  });

  const handleSelectedImage = e => {
    e.preventDefault();
    setImage(e.target.files[0]);
  };

  const handleSelectedBody = e => {
    e.preventDefault();
    setBody(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("image", image, image.name);
    data.append("body", body, body.name);
    data.append("title", title);
    data.append("tags", tags);

    const res = await Axios.post(`${url}/byte/`, data, {
      onUploadProgress: ProgressEvent => {
        setLoaded((ProgressEvent.loaded / ProgressEvent.total) * 100);
        setMessage(
          ProgressEvent.loaded === ProgressEvent.total
            ? "Byte succesfully posted"
            : ""
        );
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };
  return (
    <Layout>
      <div>
        <form onSubmit={handleSubmit}>
          <div style={layout}>
            <input
              style={textFieldStyle}
              type="text"
              value={title}
              onChange={(e: any) => setTitle(e.target.value)}
              required
              placeholder="title"
            />
          </div>
          <div style={layout}>
            <input
              style={textFieldStyle}
              type="text"
              value={tags}
              onChange={(e: any) => setTags(e.target.value)}
              required
              placeholder="tags"
            />
          </div>
          <div style={layout}>
            <input
              type="file"
              name="image"
              onChange={handleSelectedImage}
              required
              accept="image/png"
            />
          </div>
          <div style={layout}>
            <input
              type="file"
              name="body"
              onChange={handleSelectedBody}
              required
              accept=".md"
            />
          </div>
          <input style={layout} type="submit" value="Submit" />
          <div> {Math.round(loaded)} %</div>
        </form>
        <div style={{ color: "red" }}>{message}</div>
      </div>
    </Layout>
  );
}

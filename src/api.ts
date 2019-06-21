import Axios from "axios";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const { URL: url } = publicRuntimeConfig;

const instance = Axios.create({
  baseURL: url,
  timeout: 2500
});

export default instance;

export async function getByteList(page: number) {
  try {
    const res = await instance.get(`/byte/list/?page=${page}`);
    const data = res.data;
    return data;
  } catch (err) {
    console.error(err);
    return { err };
  }
}

export async function getByte(id: number) {
  try {
    const res = await instance.get(`/byte/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    return { err };
  }
}

export async function getNumPage() {
  const numBytePerPage = 10;
  const res = await instance.get(`/byte/count`);
  const numBytes = res.data.count;
  return Math.ceil(numBytes / numBytePerPage);
}

export async function loadFile(filePath: string) {
  return await Axios.get(filePath);
}

export async function getUser(email: string) {
  const res = await instance.get(`/user/?email=${email}`);
  return res.data;
}

export async function login(email: string, password: string) {
  try {
    const res = await instance.post(`/user/login`, {
      email,
      password
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return { err };
  }
}

export async function signup(name: string, email: string, password: string) {
  try {
    const res = await instance.post("/user/signup", {
      name,
      email,
      password,
      admin: false
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return { err };
  }
}

export async function deleteByte(id: string, token: string) {
  try {
    const res = await instance.delete(`/byte/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (err) {
    console.log(err);
    return { err };
  }
}

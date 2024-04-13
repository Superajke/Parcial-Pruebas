import axios from "./axios";

export const getUserRequest = async () => {
  return await axios.get("http://localhost:3000/api/v1/users", {
    withCredentials: true,
  });
};

export const createUserRequest = async (user) => {
  return await axios.post(`http://localhost:3000/api/v1/users`, user);
};

export const updateUserRequest = async (user) => {
  return await axios.put(`http://localhost:3000/api/v1/users`, user);
};

export const deleteUserRequest = async (id) => {
  return await axios.delete(`http://localhost:3000/api/v1/users/${id}`);
};

export const loginUserRequest = async (user) => {
  return await axios.post("http://localhost:3000/api/v1/users/login", user);
};

export const logOutRequest = async () =>
  await axios.post(`http://localhost:3000/api/v1/users/logout`);

export const verifyTokenRequest = async () => {
  return await axios.get(
    `http://localhost:3000/api/v1/users/verifytoken`,
    {},
    {
      withCredentials: true,
    }
  );
};

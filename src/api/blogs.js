import api from "./axiosConfig";

export const getBlogs = async (admin = false) => {
  const res = await api.get(`/blogs?admin=${admin}`);
  return res.data;
};

export const getBlogById = async (id) => {
  const res = await api.get(`/blogs/${id}`);
  return res.data;
};

export const createBlog = async (blogData) => {
  const res = await api.post("/blogs", blogData);
  return res.data;
};

export const updateBlog = async (id, blogData) => {
  const res = await api.put(`/blogs/${id}`, blogData);
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await api.delete(`/blogs/${id}`);
  return res.data;
};


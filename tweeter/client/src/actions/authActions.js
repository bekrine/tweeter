import {
  REGISTER_START,
  REGISTER_OK,
  REGISTER_FAIL,
  LOGIN_OK,
  LOGIN_START,
  LOGIN_FAIL,
  SET_USER,
  LOADING,
  PROFILE_OK,
  PROFILE_FAIL,
  LOGOUT,
  SET_PROFILE,
  POST_OK,
  FETCH_POSTS,
} from "./types";
import axios from "axios";
import jwt from "jsonwebtoken";

 
const API_URL=process.env.REACT_APP_API_URL

export const registerUser = (formValues) =>async (dispatch) => {
  try {
    dispatch({ type: REGISTER_START });
    const res= await axios.post(`${API_URL}/user/register`, formValues)
    await dispatch({ type: REGISTER_OK, payload: res.data });
    localStorage.setItem("token", res.data.token);
    return "OK";
  } catch (error) {
    await dispatch({ type: REGISTER_FAIL, error: error.response.data });
    console.log(error);
  }
};

export const loginUser = (formValues) =>async (dispatch) => {
   try {
      dispatch({ type: LOGIN_START });
      const res= await  axios.post(`${API_URL}/user/login`, formValues)
      await dispatch({ type: LOGIN_OK, payload: res.data });
      localStorage.setItem("token", res.data.token);
      return "OK";
     
   } catch (error) {
      await dispatch({ type: LOGIN_FAIL, error: error.response.data });
      console.log(error);
   }
};

export const getUser = (token) => async (dispatch) => {
  try {
      await dispatch({ type: LOADING, payload: true });
      let decoded = await jwt.decode(token);
      let uid = decoded._id;

      const res = await axios.get(`${API_URL}/user/${uid}`)
      await dispatch({ type: SET_USER, payload: res.data });
      await dispatch({ type: LOADING, payload: false });
      
  } catch (error) {
    console.log(error);
    await dispatch({ type: LOADING, payload: false });
  }
};

export const getProfile = (token) => async (dispatch) => {
   try {
     let decoded = await jwt.decode(token);
     let uid = decoded._id;
     const res= await axios.get(`${API_URL}/user/profile/${uid}`)
     dispatch({ type: SET_PROFILE, payload: res.data });
     localStorage.setItem("profile", JSON.stringify(res.data));
   } catch (error) {
     console.log(error);
   }
};

export const newProfile = (formValues, userId) =>async (dispatch) => {
  try {
     const res = axios.post(`${API_URL}/user/profile/${userId}`,formValues)
     await dispatch({ type: PROFILE_OK, payload: res.data });
     localStorage.setItem("profile", JSON.stringify(res.data));
     return "OK";
  } catch (error) {
     console.log(error);
     await dispatch({ type: PROFILE_FAIL, error: error.response.data });
     return "BAD";
  }
};

export const logout = () => async (dispatch) => {
  try {
    await localStorage.clear("token");
    await localStorage.clear("profile");
    await dispatch({ type: LOGOUT });
    return "OK";
  } catch (error) {
    console.log(error);
  }
};

export const createPost = (formValues) => async (dispatch) => {
    try {
       const token = localStorage.getItem("token");
       let userId = await jwt.decode(token);
    
       const res=await axios.post( `${API_URL}/posts/new/${userId._id}`,formValues)

       dispatch({ type: POST_OK, payload: res.data });
       return "OK";
    } catch (error) {
      console.log(error);
    }
};

export const getAllPosts = () =>async (dispatch) => {
  try {
    const res= await axios.get(`${API_URL}/posts/all`)
    dispatch({ type: FETCH_POSTS, payload: res.data });
  } catch (error) {
    console.log(error);
  }

};

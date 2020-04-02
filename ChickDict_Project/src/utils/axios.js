import axios from 'axios' 
import actionCreator from '../store/actionCreator'
import store from '../store/store'
import {message} from 'antd'
axios.interceptors.request.use(function (config) {
  //token在登录时存储到localStorage,现在是写死的
  let token = 'notoken'
  // let token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjVlN2YwMDU5OGNmNzRiNzAyY2MyZGQzYyIsInVzZXIiOiJyb290IiwibGVhdmVsIjoicm9vdCJ9LCJjdGltZSI6MTU4NTYyODgyMDAwOSwiZXhwaXJlc0luIjo4NjQwMDAwMCwiaWF0IjoxNTg1NjI4ODIwfQ.NXolryBFNhN4ED7h0QQVBx4eWOlGTTZq6bS4jJdubBM";
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjVlN2YwMDU5OGNmNzRiNzAyY2MyZGQzYyIsInVzZXIiOiJyb290IiwicGFzcyI6IjEyMyIsImxlYXZlbCI6InJvb3QiLCJfX3YiOjB9LCJjdGltZSI6MTU4NTM4MTQ3Nzc5OCwiZXhwaXJlc0luIjo4NjQwMDAwMCwiaWF0IjoxNTg1MzgxNDc3fQ.FXvkkprecptdBJQSfOnw41kAr1og00xm0XP0Rmde4zc"
  //从本地存储获取token
  if(localStorage.getItem('token')){
    token = localStorage.getItem('token')
  }
  config.headers.Authorization = "Bearer "+token
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  let action = actionCreator.CHANGE_TOKEN_MODAL
  if(response.data.err !== 0){
    if(response.data.err === 403){
      message.warning('权限不足')
    }else if(response.data.err !== -1){
      store.dispatch(action(true))
    }
  }else if(response.data.err === 0){
    store.dispatch(action(false))
  }
  return response.data;
}, function (error) {
  return Promise.reject(error);
});
export default axios 
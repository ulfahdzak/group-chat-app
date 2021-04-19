import React from "react";
import { Login } from "./components/login";
import { Chatroom } from "./components/chatroom";
import { useSelector } from "react-redux";
export default function App() {
  const isLogin = useSelector((state) => state.loginReducer.isLogin);
  return <div className="App">{isLogin ? <Chatroom /> : <Login />}</div>;
}

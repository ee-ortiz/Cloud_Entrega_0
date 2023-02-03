import React, {useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import SinginAndUp from "../components/SinginAndUp";



const Routing = (props) => {

  /* */
  return (
    <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<SinginAndUp modo = "in"/>} />
          <Route exact path="/singup" element={<SinginAndUp modo = "up"/>}/>
          {/* Llevar a la ruta home. El componente tiene 2 parámetros: id, token*/}
          {/* Dichos parámetros serán suministrados por local storage*/}
          <Route exact path="/home" element={<Home id = {localStorage.getItem("id")} token = {localStorage.getItem("token")}/>}/>
          {/* Generic fallback for unknown routes*/}
          <Route path="*" element={<SinginAndUp modo = "in" />} />
        </Routes>
    </BrowserRouter>
  );
};
export default Routing;

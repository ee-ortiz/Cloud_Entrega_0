import React, { useState, useEffect } from "react";
import { SingIn, GetUsuario, DeleteEvento } from "../utilities/requests";
import { Link, useBeforeUnload } from 'react-router-dom';

import "./styles.css";

function VerDetalle(props) {

  console.log("Detallitos", props.evento)

  // el objeto props.evento es de la siguiente forma
  //{
   // "id": 1,
   // "nombre": "Evento 5",
   // "categoria": "Conferencia",
   // "lugar": "Lugar 5",
   // "direccion": "Direccion 5",
   // "fecha_inicio": "2021-01-01",
   // "fecha_fin": "2021-01-03",
   //"presencial": true,
   // "usuario_id": 1
   //}  
  // crear un componente que muestra toda esta información en una lista
  return (
    <div className="container">
        <div className="row">
            <div className="col-12">
                <h1>Detalle del evento</h1>
                <ul>
                    <li>Nombre: {props.evento.nombre}</li>
                    <li>Categoria: {props.evento.categoria}</li>
                    <li>Lugar: {props.evento.lugar}</li>
                    <li>Direccion: {props.evento.direccion}</li>
                    <li>Fecha Inicio: {props.evento.fecha_inicio}</li>
                    <li>Fecha Fin: {props.evento.fecha_fin}</li>
                    <li>Presencial: 
                        {props.evento.presencial ? "Si" : "No"}
                        </li>
                </ul>
            </div>
        </div>
    </div>
    );

 
}


export default VerDetalle;
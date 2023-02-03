import React, { useState, useEffect } from "react";
import { SingIn, GetUsuario, DeleteEvento } from "../utilities/requests";
import { Link, useBeforeUnload } from 'react-router-dom';


import "./styles.css";

function EditarEventoForm(props) {

    // handle submit debe enviar los datos del formulario al servidor
    // para que sean actualizados
    const handleSubmit = (e) => {

        //Prevent page reload
        e.preventDefault();
        
        // obtener los campos del Form
        const nombre = document.getElementById("nombre").value;
        const categoria = document.getElementById("categoria").value;
        const lugar = document.getElementById("lugar").value;
        const direccion = document.getElementById("direccion").value;
        const fecha_inicio = document.getElementById("fecha_inicio").value;
        const fecha_fin = document.getElementById("fecha_fin").value;
        const opciones = document.getElementById("presencial")
        const presencial = opciones.options[opciones.selectedIndex].value;

        console.log("PRESENCIAL", presencial)

        // crear un objeto con los datos del evento
        const evento = {
            nombre: nombre,
            categoria: categoria,
            lugar: lugar,
            direccion: direccion,
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin,
            presencial: presencial
        }
        
        props.HandleEditarEvento(props.evento.id, evento)
        
    }


  
    // retornar un formulario que reciba de input los datos del evento a editar
    // el formulario debe tener un botón para guardar los cambios
    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <h1>Editar Evento</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input type="text" className="form-control" id="nombre" placeholder="Nombre del evento" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="categoria">Categoria</label>
                            <select className="form-control" id="categoria">
                                <option>Conferencia</option>
                                <option>Seminario</option>|
                                <option>Congreso</option>
                                <option>Curso</option>

                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lugar">Lugar</label>
                            <input type="text" className="form-control" id="lugar" placeholder="Lugar del evento" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="direccion">Direccion</label>
                            <input type="text" className="form-control" id="direccion" placeholder="Direccion del evento" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fecha_inicio">Fecha Inicio</label>
                            <input type="date" className="form-control" id="fecha_inicio" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fecha_fin">Fecha Fin</label>
                            <input type="date" className="form-control" id="fecha_fin" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="presencial">Presencial</label>
                            <select className="form-control" id="presencial">
                                <option>true</option>
                                <option>false</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Guardar</button>
                    </form>
                </div>
            </div>
        </div>
        );
}


export default EditarEventoForm;
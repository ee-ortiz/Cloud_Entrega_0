import React, { useState, useEffect } from "react";
import { SingIn, GetUsuario, DeleteEvento, EditarEvento, AgregarEvento } from "../utilities/requests";
import { Link, useBeforeUnload } from 'react-router-dom';
import VerDetalle from "./VerDetalle";

import "./styles.css";
import EditarEventoForm from "./EditarEventoForm";
import AgregarEventoForm from "./AgregarEventoForm";

function Home(props) {

  // useState par guardar los eventos
  const [eventos, setEventos] = useState([]);
  // useState para evento detalle
  const [eventoDetalle, setEventoDetalle] = useState(null);
  // useState para evento a editar
  const [eventoEditar, setEventoEditar] = useState(null);

  useEffect(() => {
    console.log("ID y token", props.id, props.token);
    
    // fetch data
    const dataFetch = async () => {
      // obtener los eventos
      const usuario = await GetUsuario(props.id, props.token);
      // convertir a json
      const usuarioJson = await usuario.json();
      // guardar los eventos en el estado
      setEventos(usuarioJson.Eventos);
    }
    // llamar a la funcion
    dataFetch();
  }, []);

  // useEffect de eventos
  useEffect(() => {
    console.log(eventos);
  }, [eventos]);

  const HandleEditarEvento = (id, evento) => {

    console.log(evento.presencial)
    console.log("ver varlor", evento.presencial  === 'true')
    
    const objetoEvento = 
    {
      "Nombre": evento.nombre,
      "Categoria": evento.categoria,
      "Lugar": evento.lugar,
      "Direccion": evento.direccion,
      "Fecha Inicio": evento.fecha_inicio,
      "Fecha Fin": evento.fecha_fin,
      "Presencial": evento.presencial  === 'true' ? true : false
  }
    
    
    // llamar al api para editar el evento
    EditarEvento(id, props.token, objetoEvento)

    // actualizar el estado de eventos
    const eventosActualizados = eventos.map((eventoActual) => {
      if (eventoActual.id === id) {
        return evento;
      } else {
        return eventoActual;
      }
    });

    console.log("ACT", eventosActualizados)
    
    // guardar los eventos actualizados en el estado
    setEventos(eventosActualizados);

  }


  // handle agregar evento
  const HandleAgregarEvento = (evento) => {

    const objetoEvento = 
    {
      "Nombre": evento.nombre,
      "Categoria": evento.categoria,
      "Lugar": evento.lugar,
      "Direccion": evento.direccion,
      "Fecha Inicio": evento.fecha_inicio,
      "Fecha Fin": evento.fecha_fin,
      "Presencial": evento.presencial  === 'true' ? true : false,
      "Usuario": props.id
  }

    // llamar al api para agregar el evento
    AgregarEvento(props.token, objetoEvento)
    // actualizar el estado de eventos
    setEventos([...eventos, evento]);
  }





  // retornar una tabla con los datos de los usuarios
  // la tabla debe tener 3 Botones en cada fila: Uno para elinimar, otro para editar y otro para ver el detalle
  // también la tabla debe tener un estilo striped por fila y columna
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1>Eventos</h1>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Fecha Inicio</th>
                <th scope="col">Fecha Fin</th>
                {/* editar */}
                <th scope="col">Editar</th>
                {/* eliminar */}
                <th scope="col">Eliminar</th>
                {/* ver detalle */}
                <th scope="col">Ver Detalle</th>
              </tr>
            </thead>
            <tbody>
              {eventos?.map((evento) => (
                <tr key={evento.id}>
                  <td>{evento.nombre}</td>
                  <td>{evento.fecha_inicio}</td>
                  <td>{evento.fecha_fin}</td>
                  {/* Boton Editar */}
                  <td>
                      <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setEventoEditar(evento)
                        }
                      }
                      >Editar</button>
                  </td>
                  {/* Boton Eliminar */}
                  <td>
                      <button 
                      className="btn btn-danger"
                      onClick={() => {
                        // llarma a la funcion eliminar evento con el ID del evento a eliminar
                        DeleteEvento(evento.id, props.token);
                        setEventos(eventos.filter((ev) => ev.id !== evento.id));
                        }
                      }
                      >
                      Eliminar</button>
                  </td>
                  {/* Boton Ver Detalle */}
                  <td>
                      <button 
                      className="btn btn-success"
                      onClick={() => {
                        setEventoDetalle(evento)
                        }
                      }
                      
                      >Ver Detalle</button>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pestaña de detalle de evento. Si evento detalle no es null mostrarla */}
        {eventoDetalle !== null ? (<VerDetalle evento = {eventoDetalle}/>):
        (<div></div>)}
        {/* Pestaña de editar un evento. Si eventoEditar no es null mostrarla */}
        {eventoEditar !== null ? (<EditarEventoForm evento = {eventoEditar} HandleEditarEvento = {HandleEditarEvento}/>):
        (<div></div>)}
        {/* Pestaña con componente AgregarEventoForm */}
        <AgregarEventoForm HandleAgregarEvento = {HandleAgregarEvento}/>


        

      </div>
    </div>
  );

 
}


export default Home;
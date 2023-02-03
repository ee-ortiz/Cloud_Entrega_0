import React, { useState } from "react";
import { SingIn, SingUp } from "../utilities/requests";
import { Link, useNavigate } from 'react-router-dom';


import "./styles.css";

function SinginAndUp(props) {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // navigate
  const navigate = useNavigate();

 
  // Si props.modo = "in" entonces titulo = "Iniciar Sesión"
  // de lo contrario titulo = "Registrarse"
  const titulo = props.modo === "in" ? "Iniciar Sesión" : "Registrarse";

  // Si props.modo = "in" entonces vinculo = "Registrarse"
  // de lo contrario vinculo = "Iniciar Sesión"
  const vinculo = props.modo === "in" ? "singup" : "/";
  const tituloVinculo = props.modo === "in" ? "Registrarse" : "Iniciar Sesión";


  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();

    // valores del form
    var { uname, pass } = document.forms[0];

    // valores del correo y contraseña
    var correo = uname.value;
    var contraseña = pass.value;

    if (props.modo === "in"){
    
    // Find user login info
    SingIn(correo, contraseña).then((response) => {
      if (response.status === 200) {
        // User found
        console.log("Bien", response.status)
        return response.json();
      } else {
        // User not found
        console.log("Mal", response.status)
        setErrorMessages({ name: "pass", message: "usuario o contraseña incorrectos" });
      }
    }).then((userData) => {
      // guardar token
      localStorage.setItem("token", userData.token);
      // guardar id del usuario
      localStorage.setItem("id", userData.id);
      // cambiar de pestaña con Link de react-router-dom
      
      setTimeout(() => {
    }, 2000);

      navigate("/home")


    }).catch(err => {
      console.log('caught it!',err);
   });

  }

   else{

    // Find user login info
    SingUp(correo, contraseña).then((response) => {
      if (response.status === 200) {
        // User found
        console.log("Bien", response.status)
        return response.json();
      } else {
        // User not found
        console.log("Mal", response.status)
        setErrorMessages({ name: "pass", message: "usuario o contraseña incorrectos" });
      }
    }).then((userData) => {
      // guardar token
      localStorage.setItem("token", userData.token);
      // guardar id del usuario
      localStorage.setItem("id", userData.id);
      // cambiar de pestaña con Link de react-router-dom
      
      setTimeout(() => {
    }, 2000);

      navigate("/home")


    }).catch(err => {
      console.log('caught it!',err);
   });

  }

}


  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label>Correo </label>
          <input type="text" name="uname" required />
          {renderErrorMessage("uname")}
        </div>
        <div className="input-container">
          <label>Contraseña </label>
          <input type="password" name="pass" required />
          {renderErrorMessage("pass")}
        </div>
        <div className="button-container">
          <input type="submit" />
        </div>
        <div className="separator"></div>
        <div className="button-container">
          <Link to={vinculo}>{tituloVinculo}</Link>
        </div>
        
      </form>
    </div>
  );

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">{titulo}</div>
        {isSubmitted ? <div>User is successfully logged in</div> : renderForm}
      </div>
    </div>
  );
}


export default SinginAndUp;
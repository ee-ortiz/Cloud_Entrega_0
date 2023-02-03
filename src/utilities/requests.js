// funcion que hace la peticion a la api
// particularmente hace una petición de tipo POST http://localhost:5000/singin
// el request tipo json tiene los campos Correo y Contraseña
function SingIn(correo, contraseña) { 
    // a partir del proxy definido en package.json llamar a login
    return fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            Correo: correo,
            Contraseña: contraseña,
        }),
    });
}

// funcion que hace la peticion a la api
// particularmente hace una petición de tipo POST http://localhost:5000/singup
// el request tipo json tiene los campos Correo y Contraseña
function SingUp(correo, contraseña) { 
    // a partir del proxy definido en package.json llamar a login
    return fetch("/singup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            Correo: correo,
            Contraseña: contraseña,
        }),
    });
}

// funcion que hace la peticion a la api
// particularmente hace una petición de tipo get http://localhost:5000/usuarios/id
// si la petición resulta exitosa extrae la propiedad eventos del json
// de igual manera la petición es de tipo get y lleva un token de autorización jwt que será pasado a la función fetch
async function GetUsuario(id, token) {
    // a partir del proxy definido en package.json llamar a login
    return fetch("/usuarios/" + id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + token,
        },
    });
}

// funcion que hace la peticion par eliminar un evento
// particularmente hace una petición de tipo delete http://localhost:5000/eventos/delete/id
// y utiliza token de autorizacion jwt
async function DeleteEvento(id, token) {
    // a partir del proxy definido en package.json llamar a login
    return fetch("/eventos/delete/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + token,
        },
    });
}


// funcion que hace la peticion par editar un evento. Es de tipo PUT
// particularmente hace una petición de tipo delete http://localhost:5000/eventos/update/id
// y utiliza token de autorizacion jwt
async function EditarEvento(id, token, evento) {
    // a partir del proxy definido en package.json llamar a login
    console.log("Update!!!")
    
    return fetch("/eventos/update/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + token,
        },
        body: JSON.stringify(evento),
    });
}


// funcion que hace la peticion par agregar un evento. Es de tipo POST
// particularmente hace una petición de tipo delete http://localhost:5000/eventos/add
// y utiliza token de autorizacion jwt
async function AgregarEvento(token, evento) {
    // a partir del proxy definido en package.json llamar a login
    console.log("Update!!!")
    
    return fetch("/eventos/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + token,
        },
        body: JSON.stringify(evento),
    });

}






export { SingIn, GetUsuario, DeleteEvento, EditarEvento, SingUp, AgregarEvento };


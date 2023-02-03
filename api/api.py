from flask import Flask,  request, jsonify, make_response
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
from enum import Enum
from flask_jwt_extended import jwt_required, create_access_token
from flask_jwt_extended import JWTManager

# lidiar con fechas
from datetime import datetime
from json import dumps
from flask_cors import CORS


# crear una instancia de flask
app = Flask(__name__)
# cors
CORS(app)
# crear objeto de la clase Api
api = Api(app)
# crear base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# configurar llave secreta para jwt
app.config["JWT_ALGORITHM"] = "HS256"
app.config["JWT_SECRET_KEY"] = b'_5#y2L"F4Q8z\n\xec]/'
# inicializar jwt
jwt = JWTManager(app)
# crear contexto de la aplicacion
app.app_context().push()


# crear objeto de la clase SQLAlchemy
db = SQLAlchemy(app)

# converlir una lista de diccionarios a un diccionario
def convert_list_to_dict(lista):
    diccionario = {}
    for dic in lista:
        diccionario[dic.id] = dic
    print(type(diccionario))
    print(dumps(diccionario))
    return diccionario

# serializar la clase evento
def serialize_event(event):
    return {
        'id': event.id,
        'nombre': event.nombre,
        'categoria': event.categoria,
        'lugar': event.lugar,
        'direccion': event.direccion,
        'fecha_inicio': event.formatted_fecha_inicio,
        'fecha_fin': event.formatted_fecha_fin,
        'presencial': event.presencial,
        'usuario_id': event.usuario_id
    }

# serializar una lista de eventos
def serialize_events(events):
    return [serialize_event(event) for event in events]


# ------------------------------------------------- Modelos -------------------------------------------------

# clase categoria
class Categoria(str, Enum):
    Conferencia = "Conferencia"
    Seminario = "Seminario"
    Congreso = "Congreso"
    Curso = "Curso"


# clase usuario
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    correo = db.Column(db.String(50), nullable=False)
    contrasena = db.Column(db.String(50), nullable=False)
    eventos = db.relationship('Evento', cascade='all, delete, delete-orphan') # si borramos un usuario, se borran todos sus eventos


# clase evento
class Evento(db.Model):
    # Un evento está compuesto de un nombre, una categoría (las cuatro posibles categorías son: Conferencia, Seminario, Congreso o Curso), un lugar, una dirección, una fecha de inicio
    # y una fecha de fin, y si el evento es presencial o virtual
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    categoria = db.Column(db.Enum(Categoria), nullable=False)
    lugar = db.Column(db.String(50), nullable=False)
    direccion = db.Column(db.String(50), nullable=False)
    fecha_inicio = db.Column(db.DateTime, nullable=False)
    fecha_fin = db.Column(db.DateTime, nullable=False)
    presencial = db.Column(db.Boolean, nullable=False)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuario.id'), nullable=False) # es neceario que un evento tenga un usuario asociado

    @property
    def formatted_fecha_inicio(self):
        return self.fecha_inicio.strftime("%Y-%m-%d")

    @property
    def formatted_fecha_fin(self):
        return self.fecha_fin.strftime("%Y-%m-%d")

    # Representacion del objeto como un string
    def __repr__(self):
        return {'id': self.id,'nombre': self.nombre, 'categoria': self.categoria, 
                    'lugar': self.lugar, 'direccion': self.direccion, 
                    'fecha_inicio': self.formatted_fecha_inicio, 
                    'fecha_fin': self.formatted_fecha_fin, 'presencial': 
                    self.presencial, 'usuario_id': self.usuario_id
                }



# ------------------------------------------------- Vistas -------------------------------------------------

# GET request de los eventos a la direccion http://localhost:5000/eventos
class GetEventos(Resource):
    def get(self):
        # Obtener todos los eventos
        eventos = Evento.query.all()
        event_list = []
        # mapearlos a una lista de diccionarios
        for event in eventos:
            event_data = {'Id': event.id, 'Nombre': event.nombre, 'Categoria': event.categoria, 'Lugar': event.lugar,
                        'Direccion': event.direccion, 'Fecha Inicio': event.formatted_fecha_inicio, 'Fecha Fin': event.formatted_fecha_fin, 'Presencial': event.presencial, 'Usuario': event.usuario_id}
            event_list.append(event_data)
        # devolver el objeto json y el codigo de estado
        return {"eventos": event_list}, 200


# GET request de un evento a la direccion http://localhost:5000/eventos/?
class GetEvento(Resource):
    def get(self, id):
        # obtener el evento
        event = Evento.query.get(id)
        # si el evento no existe, retornar error
        if event is None:
            return {'error': 'not found'}, 404
        # de lo contrario, retornar el evento
        else:
            return {'Id': event.id, 'Nombre': event.nombre, 'Categoria': event.categoria, 'Lugar': event.lugar,
                        'Direccion': event.direccion, 'Fecha Inicio': event.formatted_fecha_inicio, 'Fecha Fin': event.formatted_fecha_fin, 'Presencial': event.presencial, 'Usuario': event.usuario_id}, 200


# POST request de un evento a la direccion http://localhost:5000/eventos/add
class AddEvento(Resource):
    @jwt_required()
    def post(self):
        if request.is_json:
            event = Evento(nombre=request.json['Nombre'], categoria=request.json['Categoria'], lugar=request.json['Lugar'], 
                direccion=request.json['Direccion'], fecha_inicio=datetime.strptime(request.json['Fecha Inicio'], '%Y-%m-%d'), 
                fecha_fin=datetime.strptime(request.json['Fecha Fin'], '%Y-%m-%d'), 
                presencial=request.json['Presencial'], usuario_id=request.json['Usuario'])

            # añadir evento a la base de datos
            db.session.add(event)
            # guardar cambios
            db.session.commit()
            # retornar el evento creado con su respectivo codigo de estado
            return make_response(
                        jsonify({'Id': event.id, 'Nombre': event.nombre, 'Categoria': event.categoria, 'Lugar': event.lugar,
                        'Direccion': event.direccion, 'Fecha Inicio': event.formatted_fecha_inicio, 
                        'Fecha Fin': event.formatted_fecha_fin, 'Presencial': event.presencial, 'Usuario': event.usuario_id}
                        ), 201)
        else:
            return {'error': 'Request must be JSON'}, 400

# Post request de un evento a la direccion http://localhost:5000/usuarios/delete/?


# PUT request de un evento a la direccion http://localhost:5000/eventos/update/?
class UpdateEvento(Resource):
    @jwt_required()
    def put(self, id):
        if request.is_json:
            event = Evento.query.get(id)
            # si el evento no existe, retornar error
            if event is None:
                return {'error': 'not found'}, 404
            # de lo contrario, actualizar los campos
            else:
                # actualizar los campos que no sean nulos
                event.nombre = event.nombre if request.json.get('Nombre') is None else request.json['Nombre']
                event.categoria = event.categoria if request.json.get('Categoria') is None else request.json['Categoria']
                event.lugar = event.lugar if request.json.get('Lugar') is None else request.json['Lugar']
                event.direccion = event.direccion if request.json.get('Direccion') is None else request.json['Direccion']
                event.fecha_inicio = event.fecha_inicio if request.json.get('Fecha Inicio') is None else datetime.strptime(request.json['Fecha Inicio'], '%Y-%m-%d')
                event.fecha_fin = event.fecha_fin if request.json.get('Fecha Fin') is None else datetime.strptime(request.json['Fecha Fin'], '%Y-%m-%d')
                event.presencial = event.presencial if request.json.get('Presencial') is None else request.json['Presencial']
                event.usuario_id = event.usuario_id # no se puede actualizar el usuario
                # guardar cambios
                db.session.commit()
                return 'Updated', 200
        else:
            return {'error': 'Request must be JSON'}, 400

# Delete request de un evento a la direccion http://localhost:5000/eventos/delete/?
class DeleteEvento(Resource):
    @jwt_required()
    def delete(self, id):
        event = Evento.query.get(id)
        # si el evento no existe, retornar error
        if event is None:
            return {'error': 'not found'}, 404
        # de lo contrario, eliminar el evento
        db.session.delete(event)
        # guardar cambios
        db.session.commit()
        return f'{id} is deleted', 200


# GET request de todos los usuarios a la direccion http://localhost:5000/usuarios
class GetUsuarios(Resource):
    def get(self):
        # obtener todos los usuarios
        usuarios = Usuario.query.all()
        # si no hay usuarios, retornar error
        if len(usuarios) == 0:
            return {'error': 'not found'}, 404
        # de lo contrario, retornar los usuarios
        else:

            # lista con los ids de todos los eventos asociados al usuario
            return [{'Id': usuario.id, 'Correo': usuario.correo, 'Contraseña': usuario.contrasena, 'Eventos': serialize_events(usuario.eventos)} for usuario in usuarios], 200


# GET request de un usuario a la direccion http://localhost:5000/usuarios/?
class GetUsuario(Resource):
    @jwt_required()
    def get(self, id):
        # obtener el usuario
        usuario = Usuario.query.get(id)
        # si el usuario no existe, retornar error
        if usuario is None:
            return {'error': 'not found'}, 404
        # de lo contrario, retornar el usuario
        else:
            return {'Id': usuario.id, 'Correo': usuario.correo, 'Contraseña': usuario.contrasena, 'Eventos': serialize_events(usuario.eventos)}, 200


# Sing Up de un usuario
# POST request de un usuario a la direccion http://localhost:5000/singup
class SingUp(Resource):
    def post(self):
        if request.is_json:
            # obtener los campos del usuario
            correo = request.json['Correo']
            contrasena = request.json['Contraseña']
            # crear el usuario
            usuario = Usuario(correo=correo, contrasena=contrasena)
            # añadir usuario a la base de datos
            db.session.add(usuario)
            # guardar cambios
            db.session.commit()

            # Retornar el token de acceso
            token_de_acceso = create_access_token(identity = usuario.id)
            return {"mensaje":"usuario creado exitosamente", "token":token_de_acceso, "id":usuario.id}


        else:
            return {'error': 'Request must be JSON'}, 400


# Log in de un usuario
# POST request de un usuario a la direccion http://localhost:5000/login
class LogIn(Resource):
    def post(self):
        if request.is_json:
            # obtener los campos del usuario
            correo = request.json['Correo']
            contrasena = request.json['Contraseña']
            # obtener el usuario
            usuario = Usuario.query.filter_by(correo=correo, contrasena=contrasena).first()
            # si el usuario no existe, retornar error
            if usuario is None:
                return {'error': 'not found'}, 404
            # de lo contrario, retornar el usuario
            else:
                # Retornar el token de acceso
                token_de_acceso = create_access_token(identity = usuario.id)
                return {"mensaje":"usuario encontrado", "token":token_de_acceso, "id":usuario.id}  
        else:
            return {'error': 'Request must be JSON'}, 400



# PUT request de un usuario a la direccion http://localhost:5000/usuarios/update/?
class UpdateUsuario(Resource):
    def put(self, id):
        if request.is_json:
            # obtener el usuario
            usuario = Usuario.query.get(id)
            # si el usuario no existe, retornar error
            if usuario is None:
                return {'error': 'not found'}, 404
            # de lo contrario, actualizar los campos del usuario
            else:
                usuario.correo = usuario.correo if request.json.get('Correo') is None else request.json['Correo']
                usuario.contrasena = usuario.contrasena if request.json.get('Contraseña') is None else request.json['Contraseña']
                # guardar cambios
                db.session.commit()
                return 'Updated', 200
        else:
            return {'error': 'Request must be JSON'}, 400


# PUT request de un usuario a para agregar un evento http://localhost:5000/usuarios/crear-evento/?
class UsuarioPostEvento(Resource):
    def post(self, id):
        if request.is_json:
            # obtener el usuario
            usuario = Usuario.query.get(id)
            # si el usuario no existe, retornar error
            if usuario is None:
                return {'error': 'not found'}, 404
            # de lo contrario, crear el evento
            else:
                if request.is_json:
                    event = Evento(nombre=request.json['Nombre'], categoria=request.json['Categoria'], lugar=request.json['Lugar'], 
                    direccion=request.json['Direccion'], fecha_inicio=datetime.strptime(request.json['Fecha Inicio'], '%Y-%m-%d'), 
                    fecha_fin=datetime.strptime(request.json['Fecha Fin'], '%Y-%m-%d'), 
                    presencial=request.json['Presencial'], usuario_id=id)

                # añadir evento a la base de datos
                db.session.add(event)
                # guardar cambios
                db.session.commit()
                # retornar el evento creado con su respectivo codigo de estado
                return make_response(
                            jsonify({'Id': event.id, 'Nombre': event.nombre, 'Categoria': event.categoria, 'Lugar': event.lugar,
                            'Direccion': event.direccion, 'Fecha Inicio': event.formatted_fecha_inicio, 
                            'Fecha Fin': event.formatted_fecha_fin, 'Presencial': event.presencial, 'Usuario': event.usuario_id}), 201
                            )


# Delete request de un usuario a la direccion http://localhost:5000/usuarios/delete/?
class DeleteUsuario(Resource):
    def delete(self, id):
        usuario = Usuario.query.get(id)
        # si el usuario no existe, retornar error
        if usuario is None:
            return {'error': 'not found'}, 404
        # de lo contrario, eliminar el usuario
        db.session.delete(usuario)
        # guardar cambios
        db.session.commit()
        return f'{id} is deleted', 200


# ------------------------------------------------- API -------------------------------------------------

# agregar las rutas a la API para las operaciones CRUD de evento
api.add_resource(GetEventos, '/eventos') # GET ALL
api.add_resource(GetEvento, '/eventos/<int:id>') # GET ONE
api.add_resource(AddEvento, '/eventos/add') # POST
api.add_resource(UpdateEvento, '/eventos/update/<int:id>') # PUT
api.add_resource(DeleteEvento, '/eventos/delete/<int:id>') # DELETE

# agregar las rutas a la API para las operaciones CRUD de usuario
api.add_resource(GetUsuarios, '/usuarios') # GET ALL
api.add_resource(GetUsuario, '/usuarios/<int:id>') # GET ONE
api.add_resource(SingUp, '/singup') # Sing Up
api.add_resource(LogIn, '/login') # Log In
api.add_resource(UpdateUsuario, '/usuarios/update/<int:id>') # PUT
api.add_resource(DeleteUsuario, '/usuarios/delete/<int:id>') # DELETE
api.add_resource(UsuarioPostEvento, '/usuarios/crear-evento/<int:id>') # POST

# ejecutar la aplicacion
if __name__ == '__main__':
    # crear las tablas que no existan en la base de datos
    db.create_all()
    app.run(debug=True)
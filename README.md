Backstore Backend API

Descripción del Proyecto

Este proyecto es el backend para la aplicación "Backstore", que forma parte del curso CAPSTONE impartido por el profesor Willy Francisco Bascuñán Silva en la sección CAPSTONE_007V del Duoc UC, sede San Bernardo. La finalidad de este proyecto es gestionar órdenes en tiendas, realizando funciones como la asignación de órdenes a pickers y la gestión del inventario.

Tecnologías Utilizadas

Este backend está desarrollado utilizando NestJS, un framework para construir aplicaciones Node.js eficientes y escalables. Además, se han utilizado las siguientes tecnologías y librerías clave:

GraphQL: Para la construcción de la API, permitiendo una comunicación eficiente y flexible entre el cliente y el servidor.

Mongoose: Para interactuar con la base de datos MongoDB, que se utiliza para almacenar las órdenes, usuarios y otras entidades relevantes.

Passport y JWT: Para la autenticación y la gestión de autorizaciones de usuarios, asegurando que cada usuario sólo pueda acceder a la información y funcionalidades para las que tiene permisos.

TypeScript: Como lenguaje principal de desarrollo, que permite una mejor escalabilidad y seguridad del código.

Estructura de Carpetas

src: Contiene el código fuente de la aplicación.

app.module.ts: Módulo principal de la aplicación que importa y organiza los módulos de la aplicación.

modules/: Contiene los módulos individuales como Orders, Users, Auth, etc.

services/: Contiene lógica de negocio y servicios reutilizables para diferentes componentes de la aplicación.

resolvers/: Define las consultas y mutaciones para el esquema GraphQL.

schemas/: Define los esquemas de la base de datos que Mongoose utiliza para modelar los datos.

Componentes Principales

1. Módulo de Órdenes (Orders Module)

Resolver de Orders: Implementa la lógica de GraphQL para permitir la consulta y mutación de datos relacionados con órdenes, tales como la creación de órdenes, asignación a pickers, actualizaciones y consultas de estado.

Servicio de Orders: Maneja toda la lógica de negocio relacionada con las órdenes, incluyendo la validación de datos y la interacción con la base de datos.

2. Módulo de Usuarios (Users Module)

Autenticación y Roles: Los usuarios pueden autenticarse usando JWT. Los roles de usuario (Administrador Global, Administrador de Tienda, Picker) se manejan para asegurar que cada usuario tenga acceso a las funcionalidades apropiadas.

3. Módulo de Autenticación (Auth Module)

Passport y JWT: Implementación de estrategias de autenticación y protección de rutas. Garantiza la seguridad del sistema gestionando tokens para cada usuario autenticado.

4. Módulo de Tiendas (Stores Module)

Gestionar Sucursales: Permite obtener las sucursales disponibles para la asignación de órdenes, así como la consulta de sucursales específicas.

Manual de Instalación

Requisitos Previos

Node.js v16+ y npm o yarn instalados.

MongoDB funcionando localmente o un cluster configurado.

Instrucciones de Instalación

Clonar el repositorio

git clone https://github.com/tu-usuario/backstore.git
cd backstore
git checkout backstore-backend-api

Instalar dependencias

npm install

Configurar el entorno

Crear un archivo .env en la raíz del proyecto con las siguientes variables de entorno:

NODE_ENV=DEV
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_clave_secreta_para_jwt
PORT=3000

Ejecutar el servidor en desarrollo

npm run start:dev

El servidor iniciará en http://localhost:3000.

Scripts Disponibles

start:dev: Inicia el servidor en modo desarrollo.

start:qa: Inicia el servidor en modo calidad.

start:prd: Inicia el servidor en modo producción.

test: Ejecuta las pruebas unitarias.

lint: Ejecuta el linter para verificar la calidad del código.


Contribución y Contacto

Juan Pablo Fuentes: jua.fuentes@duocuc.cl

Alonso González: al.gonzalezg@duocuc.cl

Paulo Sandoval: paul.sandoval@duocuc.cl
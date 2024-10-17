Proyecto CAPSTONE: Backstore - Frontend

Este proyecto forma parte del curso CAPSTONE de la carrera de Ingeniería en Informática en DUOCUC sede San Bernardo, bajo la guía del profesor Willy Francisco Bascuñán Silva. Pertenece a la sección CAPSTONE_007V y fue desarrollado por los siguientes integrantes del equipo:

Juan Pablo Fuentes

Alonso González

Paulo Sandoval

Objetivo del Proyecto

El proyecto Backstore tiene como objetivo la implementación de una aplicación para la gestión de órdenes, optimizando los procesos logísticos de una tienda. La aplicación permite gestionar, asignar y confirmar órdenes de compra en distintas etapas del flujo de preparación de productos.

Tecnologías Utilizadas

Este proyecto ha sido desarrollado utilizando:

React para el desarrollo del frontend.

Material UI como librería para el diseño de la interfaz de usuario.

JavaScript para la lógica de la aplicación.

Axios para las llamadas a la API.

Date-fns para el manejo de fechas.

dotenv para la gestión de configuraciones de entorno.

Componentes de la Aplicación

1. GestionOrdenes.js

Este componente se encarga de la gestión de las órdenes asignadas a la tienda. Algunas de las funcionalidades principales son:

Visualización de órdenes: Permite ver todas las órdenes disponibles para la tienda, incluyendo detalles como la fecha de la orden, estado, y asignación.

Asignación de órdenes: Facilita la asignación de una o varias órdenes a un picker (operador encargado del picking de productos).

Detallar una órden: Abre un modal que muestra detalles específicos de la órden, como los productos incluidos, imagen, cantidad, talla, color y cantidad confirmada.

Estados Backstore: Permite visualizar el estado de cada órden, mostrando si está confirmada, en quiebre parcial, total, o pendiente, usando un código de colores para facilitar la identificación.

2. PickerOrdenes.js

Este componente se utiliza para la gestión de órdenes asignadas a un picker. Algunas de sus funcionalidades incluyen:

Visualización de órdenes asignadas: Permite al picker ver las órdenes asignadas y gestionar la cantidad de productos preparados.

Confirmación de productos: El picker puede confirmar la cantidad de productos preparados, con opción de modificar la cantidad confirmada.

Estados de confirmación: Una vez que la órden está completamente confirmada o si presenta un quiebre parcial/total, la aplicación deshabilita la opción de modificar la cantidad, mostrando los valores previamente confirmados.

3. Login.js

Este componente gestiona la autenticación de los usuarios de la aplicación:

Inicio de sesión: Permite a los usuarios ingresar sus credenciales para acceder al sistema.

Manejo de tokens: Guarda el token de autenticación, así como otros datos importantes del usuario, en el almacenamiento local del navegador.

4. ProtectedLayout.js

Autorización de Acceso: Se encarga de proteger las rutas de la aplicación, asegurando que solo los usuarios autenticados puedan acceder a ciertas vistas.

Diseño de la estructura: Renderiza el menú principal y el contenido de la ruta seleccionada, creando una estructura coherente para la navegación dentro de la aplicación.

5. Home.js

Este componente muestra un panel de bienvenida al usuario luego de iniciar sesión. Incluye detalles como:

Mensaje de bienvenida: Muestra el nombre del usuario.

Sucursal asignada: Presenta la sucursal donde el picker o administrador está trabajando, si corresponde.

6. MenuPrincipal.js

El menú principal de la aplicación proporciona las rutas para acceder a las diferentes funcionalidades de la misma, adaptando las opciones disponibles según los permisos del usuario (picker o administrador).

Instalación y Configuración

Para ejecutar el proyecto localmente, siga los siguientes pasos:

Clonar el repositorio

git clone https://github.com/alonsillo88/coronaduoc.git

Cambiar a la rama correspondiente

git checkout backstore-frontend-react

Instalar dependencias
Navegue al directorio del proyecto y ejecute:

npm install

Configurar variables de entorno
Cree un archivo .env y configure las variables necesarias (consulte .env.example si está disponible).

Ejecutar la aplicación

npm start

La aplicación estará disponible en http://localhost:3001.

Scripts Disponibles

En el archivo package.json, encontrará una serie de scripts predefinidos para diferentes entornos:

npm run start:dev: Inicia la aplicación en el entorno de desarrollo.

npm run start:qa: Inicia la aplicación en el entorno de calidad (QA).

npm run start:prd: Inicia la aplicación en el entorno de producción.

npm run build:dev: Genera un build optimizado para el entorno de desarrollo.

npm run build:qa: Genera un build optimizado para el entorno de calidad.

npm run build:prd: Genera un build optimizado para el entorno de producción.

Dependencias Principales

@material-ui/core y @mui/material: Para la interfaz de usuario.

axios: Para hacer solicitudes HTTP a la API backend.

react-router-dom: Para el manejo de rutas dentro de la aplicación.

dotenv y env-cmd: Para gestionar las variables de entorno en diferentes entornos (desarrollo, QA, producción).

moment y date-fns: Para el manejo y formateo de fechas.

Contacto

Juan Pablo Fuentes (jua.fuentes@duocuc.cl)

Alonso González (al.gonzalezg@duocuc.cl)

Paulo Sandoval (paul.sandoval@duocuc.cl)
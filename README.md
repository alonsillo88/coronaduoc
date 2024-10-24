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

1. Login
El primer paso para cualquier usuario del sistema es autenticarse mediante la pantalla de Login. El archivo Login.js maneja esta funcionalidad. Aquí se solicitan las credenciales del usuario (correo electrónico y contraseña), y si las credenciales son correctas, se genera un token JWT que se almacena localmente para permitir el acceso a las funcionalidades de la aplicación según el rol del usuario.

Validaciones: Se verifica que los campos estén completos y que el formato de correo sea correcto.
Redirección: Una vez autenticado, el usuario es redirigido al Home correspondiente según el rol asignado.

2. Home
El archivo Home.js gestiona la página principal a la que acceden los usuarios tras autenticarse. La página de inicio muestra un resumen de las funcionalidades disponibles para el usuario, dependiendo de su rol en el sistema: Administrador Global, Administrador de Tienda, o Picker, También puede poseer más de un rol.

Administradores Globales: Ven un panel de administración que muestra todas las sucursales, estadísticas y la posibilidad de gestionar usuarios.
Administradores de Tienda: Tienen acceso a la gestión de órdenes de su sucursal y la asignación de órdenes a los pickers.
Pickers: Ven las órdenes que les han sido asignadas para recolección.

3. Menú Principal
MenuPrincipal.js maneja el menú de navegación dinámico que se adapta al rol del usuario:

Picker: Solo muestra las órdenes asignadas.
Administrador de Tienda: Muestra opciones para gestionar pedidos y asignar pickers.
Administrador Global: Incluye todas las funcionalidades disponibles, como gestión de usuarios, sucursales y pedidos.
Este menú garantiza que cada usuario solo vea las opciones y funcionalidades que le corresponden, lo cual mejora la experiencia y minimiza la complejidad.

4. Gestión de Órdenes
El archivo GestionOrdenes.js es fundamental para los Administradores de Tienda. Aquí se pueden visualizar todas las órdenes pendientes, asignarlas a los pickers y gestionar el estado de las órdenes.

Asignación de Órdenes: Los administradores pueden asignar órdenes a los pickers específicos. La interfaz permite seleccionar una o varias órdenes y asignarlas mediante un picker previamente registrado.
Detalle de Órdenes: Cada orden se puede visualizar en detalle, donde se muestran los productos, cantidad, cliente y otros detalles importantes.
Evidencias de Asignación: Cada vez que una orden es asignada, el administrador puede ver quién es el picker asignado y la fecha de asignación.

5. Picker Ordenes
El componente PickerOrdenes.js está diseñado para los Pickers, que son los empleados encargados de recoger los productos en la tienda. Este archivo muestra una lista de las órdenes que han sido asignadas al picker autenticado:

Revisión de Órdenes: El picker puede ver todos los detalles de las órdenes asignadas, incluyendo los productos, la cantidad solicitada, y el cliente.
Confirmación de Cantidad: Los pickers pueden actualizar la cantidad de productos recolectados. Si un producto no está disponible, se indica la razón (por ejemplo, "Faltante").
Estado de la Orden: Los pickers confirman las cantidades y el estado de la orden se actualiza automáticamente a "Confirmada", "Quiebre Parcial" o "Quiebre Total".

6. Gestión de Usuarios y Sucursales
Los Administradores Globales tienen acceso a funcionalidades adicionales a través de componentes diseñados para la gestión de usuarios y sucursales.

Gestión de Usuarios: Los administradores globales pueden registrar, modificar o eliminar usuarios del sistema. También pueden asignar roles específicos (Picker, Administrador de Tienda, etc.).
Gestión de Sucursales: Este módulo permite crear nuevas sucursales, asignar administradores a ellas y visualizar su estado actual. Esto facilita la administración y expansión del sistema en nuevas ubicaciones.

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
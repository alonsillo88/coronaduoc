# Backstore

Backstore es una aplicación móvil desarrollada en Flutter para Proyecto informático CAPSTONE de DuocUC. Esta aplicación está diseñada para gestionar diferentes funcionalidades como sincronización, asignación de picking, consolidación de recolección y consulta de stock.

## Integrantes del proyecto
- Juan Pablo Fuentes Vivanco
- Alonso González Gómez
- Paulo Andrés Sandoval Retamal

## Características principales
- **Pantalla de carga** con animación progresiva.
- **Autenticación de usuarios** con validación de credenciales.
- **Menú lateral (Drawer)** reutilizable para las diferentes pantallas de navegación.
- **Sincronización** de datos, asignación de picking, y más.

## Estructura del proyecto

lib/ │ ├── screens/ # Pantallas principales │ ├── home_screen.dart # Pantalla de inicio después del login │ ├── login_screen.dart # Pantalla de autenticación │ └── loading_screen.dart # Pantalla de carga │ ├── utils/ # Utilidades del proyecto │ └── custom_colors.dart # Colores personalizados utilizados en la app │ └── widgets/ # Widgets reutilizables └── custom_drawer.dart # Menú lateral reutilizable en diferentes pantallas

markdown
Copiar código

## Instalación

1. Clona el repositorio.
2. Asegúrate de tener el SDK de Flutter instalado.
3. Ejecuta `flutter pub get` para instalar las dependencias.
4. Inicia el proyecto con `flutter run`.

## Dependencias

- Flutter SDK
- Cupertino Icons

## Uso

Al iniciar la aplicación, se muestra una pantalla de carga que luego redirige a la pantalla de login. Tras un inicio de sesión exitoso, los usuarios son dirigidos a la pantalla principal, donde pueden acceder a las diferentes funciones del menú lateral.

## Contribución

Este proyecto es parte de un desarrollo académico. Si tienes sugerencias, siéntete libre de colaborar con el equipo.

Explicación:
Descripción general del proyecto: Incluye un resumen de lo que es la app y sus funciones principales.
Integrantes del proyecto: Se mencionan los autores del proyecto.
Características: Breve resumen de las funcionalidades implementadas.
Estructura del proyecto: Se describe la organización de las carpetas y archivos principales.
Instalación y uso: Instrucciones para instalar y ejecutar el proyecto.
Dependencias: Herramientas necesarias para ejecutar el proyecto.
Puedes agregar más detalles a medida que avance el desarrollo del proyecto.
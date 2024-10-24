# --------------------------------------------------------------------------
# Preparar Dependencias: Etapa de desarrollo
# --------------------------------------------------------------------------
FROM node:lts-alpine AS development

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los archivos de configuración de paquetes
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto al contenedor
COPY --chown=node:node . .

# Establecer permisos para el usuario sin privilegios
USER node

# --------------------------------------------------------------------------
# Preparar Imagen: Build
# --------------------------------------------------------------------------
FROM node:lts-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar dependencias desde la etapa de desarrollo
COPY --from=development /usr/src/app ./

# Crear la versión de producción de la app
RUN npm run build

# --------------------------------------------------------------------------
# Preparar Imagen: Runtime (Nginx para servir la aplicación)
# --------------------------------------------------------------------------
FROM nginx:alpine AS runtime

# Etiquetas (opcional)
LABEL author=alonso.gonzalez05@gmail.com
LABEL maintainer="Powered by Alonso Gonzalez"
LABEL cl.corona.application.name="frontend-backstore"
LABEL cl.corona.application.version="0.0.1"

# Copiar los archivos de construcción desde la etapa de build
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Configurar NGINX
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto
EXPOSE 80

ENV REACT_APP_BACKEND_URL=https://backstorebackend-ghcyc2e2hwh6b3hx.brazilsouth-01.azurewebsites.net/backstore

# Iniciar NGINX
CMD ["nginx", "-g", "daemon off;"]
# docker buildx build -t "frontend-backstorev7" -f Dockerfile .
# docker run -i -t --detach --name "frontend-backstorev7" -p 8080:8080 -t frontend-backstorev7
# docker tag frontend-backstorev7 backstorefrontendcontainer.azurecr.io/frontend-backstorev7
# az login
# az acr login --name backstorefrontendcontainer 
# docker push backstorefrontendcontainer.azurecr.io/frontend-backstorev7
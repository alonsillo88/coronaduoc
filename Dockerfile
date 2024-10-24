# -----------------------------------------------------------------------------
# Preparar Dependencias: Development dependencies
# -----------------------------------------------------------------------------
FROM node:lts-alpine AS development

# set working directory
WORKDIR /usr/src/app

# Copy project files
COPY package*.json ./

# Dependencies
RUN npm ci

#Bundle
COPY --chown=node:node . .

# Setup permissions (no-root)
USER node

# -----------------------------------------------------------------------------
# Preparar Imagen: Build
# -----------------------------------------------------------------------------
FROM node:lts-alpine AS build

# Setup workspace
WORKDIR /usr/src/app

# Copy dependencies from development stage
COPY --from=development /usr/src/app ./

# Build
RUN npm run build

# This ensures that the node_modules directory is as optimized as possible
RUN npm ci --only=production && npm cache clean --force

# Setup permissions (no-root)
USER node

# -----------------------------------------------------------------------------
# Preparar Imagen: Runtime
# -----------------------------------------------------------------------------
FROM node:lts-alpine AS runtime

# Tags
LABEL author=alonso.gonzalez05@gmail.com
LABEL maintainer="Powered by Alonso Gonzalez"
LABEL cl.corona.application.name="backstore-backend-gql-api"
LABEL cl.corona.application.version="0.0.1"


# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Variables de entorno:

ENV TZ=America/Santiago
ENV LOG_LEVEL=ALL
ENV NODE_ENV=DEV
ENV JWT_SECRET=a16a1a8637b81ebd9897e449ac7cf6578e0b866e35a133e5bf28f271bfeaa780a780b7031fd513f01aa136974a9404dd9840d794e9e060193bfa60d004dd96ee
ENV MONGO_URI=mongodb+srv://alonsogonzalez05:solaris346576@backstore.zfedb.mongodb.net/backstore?retryWrites=true&w=majority&appName=backstore

# Exponer puerto port 
EXPOSE 8080

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
# docker buildx build -t "api-backstorev2" -f Dockerfile .
# docker run -i -t --detach --name "api-backstorev3" -p 8080:8080 -t api-backstorev3
# docker tag api-backstorev3 backstorecontainer.azurecr.io/api-backstorev3
# az login
# az acr login --name backstorecontainer 
# docker push backstorecontainer.azurecr.io/api-backstorev3 

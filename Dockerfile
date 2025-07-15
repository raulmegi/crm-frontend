# 1. Build Stage: Construye la app Angular con Node 22
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Production Stage: Sirve con Nginx
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

# Copia SOLO la carpeta browser (es donde está el build para servir)
COPY --from=build /app/dist/crm-frontend/browser /usr/share/nginx/html

# Copia el archivo de configuración de nginx (asegúrate que se llame nginx.conf en la raíz)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

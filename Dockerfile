FROM node:20-alpine AS api-dependencies
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --omit=dev

FROM nginx:alpine
RUN apk add --no-cache nodejs supervisor

WORKDIR /app
COPY backend/ ./backend/
COPY database/ ./database/
COPY --from=api-dependencies /app/backend/node_modules ./backend/node_modules

WORKDIR /usr/share/nginx/html
COPY *.html *.css *.js ./
COPY assets/ ./assets/
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY supervisord.conf /etc/supervisord.conf
ENV NODE_ENV=production
ENV API_HOST=127.0.0.1
ENV API_PORT=3001
EXPOSE 80
CMD ["supervisord", "-c", "/etc/supervisord.conf"]

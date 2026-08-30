FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template
ENV API_HOST=api
ENV API_PORT=3001
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

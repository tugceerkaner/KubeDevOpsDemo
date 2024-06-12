# frontend/Dockerfile

FROM nginx:latest

# Remove default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy application files to the Nginx html directory
COPY . /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]

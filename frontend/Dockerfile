# frontend/Dockerfile

# Use an official Nginx runtime as a parent image
FROM nginx:latest

# Copy the current directory contents into the container at /usr/share/nginx/html
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

# Run nginx in foreground with custom configuration
CMD ["nginx", "-g", "daemon off;"]
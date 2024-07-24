# KubeDevOpsDemo (Basic)
 Simple Docker project  for Containerization class


## Running each containers locally (localhost)

1. Build the Docker images:
```
    docker build -t postgresql-image ./postgresql
    docker build -t backend-image ./backend
    docker build -t frontend-image ./frontend
```

2. Run the PostgreSQL container with the volume and environment variables:
```
    docker run --name devops_db --env-file .env -v db_data:/var/lib/postgresql/data -p 5432:5432  -d postgresql-image
```

3. Run the backend container with the environment variables:
```
    docker run --name backend --link devops_db:db  --env-file .env -p 5000:5000 -d backend-image
```
4. Run the backend container with the environment variables:
```
    docker run --name frontend -p 3000:3000 -d frontend-image
```

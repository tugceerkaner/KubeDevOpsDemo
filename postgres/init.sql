-- Set the time zone to Toronto
SET TIME ZONE 'UTC';

-- Create database if it doesn't exist
DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'devops_db') THEN
      PERFORM dblink_exec('dbname=' || current_database(), 'CREATE DATABASE devops_db');
   END IF;
END
$$;

-- Create user if it doesn't exist
DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'admin') THEN
      CREATE USER admin WITH ENCRYPTED PASSWORD 'postgres';
   END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE devops_db TO admin;

-- Connect to the devops_db database
\connect devops_db;

DROP TABLE IF EXISTS messages;

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS messages (
 id SERIAL PRIMARY KEY,
 name VARCHAR(100) NOT NULL,
 email VARCHAR(100) NOT NULL,
 message TEXT NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

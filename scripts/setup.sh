#! /usr/bin/env bash

# TODO: Read in env. data.
DB_HOST=""
DB_USER="root"
DB_PASSWORD="root"
DB_DATABASE="foodtracker"

# Check for the presence of `mysql`; bail if not found.
if [ ! $(command -v mysql) ]; then
  echo "Whoops, please ensure that \`mysql\` is installed before running the setup script."
  exit 1
fi

# Ensure that script is being execute from the root of the repository.
if [ ! -d "${PWD}/.git" ]; then
  echo "The setup script must be executed from the root of the repository."
  exit 2
fi

# Create database.
mysql -u "${DB_USER}" -p < ./DBSetup/create_db.sql

# Load database schema.
mysql -u "${DB_USER}" -p "${DB_DATABASE}" < ./DBSetup/create_tables.sql

# Hydrate tables.
# TODO

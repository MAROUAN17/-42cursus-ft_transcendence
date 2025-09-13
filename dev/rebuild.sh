docker compose down --rmi all --volumes --remove-orphans
docker builder prune -af
docker compose build --no-cache
docker compose up -d

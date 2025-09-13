up:
	docker compose up -d	
build:
	docker compose build --no-cache
	docker compose up -d
clean:
	docker compose down --rmi all --volumes --remove-orphans
	docker builder prune -af

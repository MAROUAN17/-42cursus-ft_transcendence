make:
	echo "Available commands: up, down, logs, build, ps, clean"
up:
	docker compose up -d sqlite

down:
	docker compose down

logs:
	docker compose logs -f sqlite

build:
	docker compose build sqlite

ps:
	docker compose ps

clean:
	docker compose down -v
	rm -rf ~/db

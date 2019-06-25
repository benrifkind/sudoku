develop:
	# Spin up containers for the server and frontend. 
	docker-compose up

develop-server:
	# Spin up container just for the python server and attach to with bash shell
	# This cannot be use concurrently with `make develop` beceause of port conflicts
	docker-compose run --service-ports sudoku-solver bash

test-server:
	# Run tests on the server in the docker container
	docker-compose run sudoku-solver bash -c "pytest -s"

lint:
	black . --check
	flake8 .

format:
	isort -rc -m 3 --trailing-comma --line-width 88 .
	black .

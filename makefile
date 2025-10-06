PWD=$(shell pwd)
run:
	docker run --rm -p 9001:80 -d \
		-e TZ=America/Lima \
	-v ${PWD}/src:/usr/share/nginx/html:ro nginx
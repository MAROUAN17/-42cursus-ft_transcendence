FROM alpine:latest
 
COPY ./tools/entry.sh /usr/local/bin/entry.sh
RUN chmod +x /usr/local/bin/entry.sh
RUN apk update && apk add sqlite && apk add bash
 
WORKDIR /db

ENTRYPOINT /usr/local/bin/entry.sh
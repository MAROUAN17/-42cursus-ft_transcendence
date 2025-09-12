FROM debian:stable

RUN apt-get update -y && \
    apt-get install -y nginx bash make git g++ \
    autoconf automake build-essential \
    libcurl4-openssl-dev libgeoip-dev liblmdb-dev \
    libpcre2-dev libtool libxml2-dev libyajl-dev \
    pkgconf wget zlib1g-dev
COPY ./tools/entry.sh /usr/local/bin/entry.sh
COPY conf/nginx.conf /etc/nginx/nginx.conf
RUN chmod +x /usr/local/bin/entry.sh

ENTRYPOINT /usr/local/bin/entry.sh
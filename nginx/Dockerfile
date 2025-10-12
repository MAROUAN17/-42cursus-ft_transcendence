FROM debian:stable-slim AS main

RUN apt-get update -y && \
    apt-get install -y make git g++ \
    autoconf automake build-essential \
    libcurl4-openssl-dev libgeoip-dev liblmdb-dev \
    libpcre2-dev libtool libxml2-dev libyajl-dev \
    pkgconf wget zlib1g-dev netcat-openbsd && rm -rf /var/lib/apt/lists/*

# build ModSecurity
RUN git clone --recursive https://github.com/owasp-modsecurity/ModSecurity ModSecurity
WORKDIR /ModSecurity

RUN ./build.sh && \
    ./configure && \
    make -j$(nproc) && \
    make -j$(nproc) install

# build ModSecurity nginx connector with same nginx version to get the module binary
WORKDIR /opt/

RUN  git clone https://github.com/owasp-modsecurity/ModSecurity-nginx && \
    wget http://nginx.org/download/nginx-1.26.3.tar.gz && \
    tar -xvzf nginx-1.26.3.tar.gz && \
    cd /opt/nginx-1.26.3 && \
    ./configure --with-compat --add-dynamic-module=/opt/ModSecurity-nginx && \
    make modules

FROM debian:stable-slim

RUN apt-get update -y && \
    apt-get install -y nginx openssl bash netcat-openbsd git libcurl4 \
    libxml2 libyajl2 libgeoip1 liblmdb0 libpcre2-8-0 && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir -p /etc/nginx/modules/ /etc/nginx/modsec/

COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY --from=main /opt/nginx-1.26.3/objs/ngx_http_modsecurity_module.so /etc/nginx/modules/
COPY --from=main /ModSecurity/modsecurity.conf-recommended /etc/nginx/modsec/modsec.conf
COPY --from=main /ModSecurity/unicode.mapping /etc/nginx/modsec/
COPY --from=main /usr/local/modsecurity/lib/libmodsecurity.so* /usr/local/lib/
RUN ldconfig

RUN mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -newkey rsa:4096 \
    -keyout /etc/nginx/ssl/key.pem \
    -out /etc/nginx/ssl/certificate.pem \
    -days 365 \
    -subj "/CN=localhost"

# configure modsecurity
RUN sed -i 's/SecRuleEngine DetectionOnly/SecRuleEngine On/' /etc/nginx/modsec/modsec.conf && \
    sed -i 's/SecAuditLogParts ABIJDEFHZ/SecAuditLogParts ABCEFHJKZ/' /etc/nginx/modsec/modsec.conf && \
    echo "Include /etc/nginx/modsec/modsec.conf" > /etc/nginx/modsec/main.conf

# get OWASP standard rules
RUN git clone https://github.com/coreruleset/coreruleset.git /modsec-rules && \
    mv /modsec-rules /etc/nginx/modsec/ && \
    mv /etc/nginx/modsec/modsec-rules/crs-setup.conf.example /etc/nginx/modsec/modsec-rules/crs-setup.conf && \
    echo "Include /etc/nginx/modsec/modsec-rules/crs-setup.conf" >> /etc/nginx/modsec/main.conf && \
    echo "Include /etc/nginx/modsec/modsec-rules/rules/*.conf" >> /etc/nginx/modsec/main.conf && \
    cat <<'EOF' >> /etc/nginx/modsec/modsec-rules/crs-setup.conf
SecAction \
    "id:900200,\
    phase:1,\
    pass,\
    t:none,\
    nolog,\
    tag:'OWASP_CRS',\
    ver:'OWASP_CRS/4.19.0-dev',\
    setvar:'tx.allowed_methods=GET HEAD POST OPTIONS DELETE'"
EOF

ENTRYPOINT [ "nginx", "-g" , "daemon off;" ]
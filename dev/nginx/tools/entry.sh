#!/bin/bash
set -x

# git clone --recursive https://github.com/owasp-modsecurity/ModSecurity ModSecurity

# cd ModSecurity
# git submodule init
# git submodule update
# ./build.sh
# ./configure
# make -j$(nproc)
# make -j$(nproc) install

# build ModSecurity nginx connector with same nginx version to get the module binary
cd /opt/
git clone https://github.com/owasp-modsecurity/ModSecurity-nginx
wget http://nginx.org/download/nginx-1.26.3.tar.gz
tar -xvzf nginx-1.26.3.tar.gz
cd /opt/nginx-1.26.3
./configure --with-compat --add-dynamic-module=/opt/ModSecurity-nginx
make modules
mkdir /etc/nginx/modules
cp ./objs/ngx_http_modsecurity_module.so /etc/nginx/modules/

# configure modsecurity
mkdir /etc/nginx/modsec
cp /ModSecurity/modsecurity.conf-recommended /etc/nginx/modsec/modsec.conf
cp /ModSecurity/unicode.mapping /etc/nginx/modsec/
sed -i 's/SecRuleEngine DetectionOnly/SecRuleEngine On/' /etc/nginx/modsec/modsec.conf
sed -i 's/SecAuditLogParts ABIJDEFHZ/SecAuditLogParts ABCEFHJKZ/' /etc/nginx/modsec/modsec.conf
echo "Include /etc/nginx/modsec/modsec.conf" > /etc/nginx/modsec/main.conf

# get OWASP standard rules
git clone https://github.com/coreruleset/coreruleset.git /modsec-rules
mv /modsec-rules /etc/nginx/modsec/
mv /etc/nginx/modsec/modsec-rules/crs-setup.conf.example /etc/nginx/modsec/modsec-rules/crs-setup.conf
echo "Include /etc/nginx/modsec/modsec-rules/crs-setup.conf" >> /etc/nginx/modsec/main.conf
echo "Include /etc/nginx/modsec/modsec-rules/rules/*.conf" >> /etc/nginx/modsec/main.conf

exec nginx -g "daemon off;"
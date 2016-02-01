#!/bin/sh
yum -y install httpd && chkconfig httpd on
/etc/init.d/httpd start
sed -i '/Listen 80/a Listen 8080' /etc/httpd/conf/httpd.conf
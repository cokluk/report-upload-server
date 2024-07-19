Host your upload server like discord webhook

Enabling the ssl setting will not give you an ssl certificate, it will only allow the return data to be returned with https instead of http. If you want to use ssl, either connect your ip address directly with cloudflare or define ssl certificate by doing reverse proxy with nginx. 

If you have let's encyrpt on your web server, you can directly define an ssl certificate.

Note: We do not provide support for this, as it is an extra preference, you will have to do it yourself.

- PHP Version - 8.1.10
- Python Version - 3.12.0
- Node Version - v20.9.0

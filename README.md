# Host your upload server like discord webhook

Just change the discord webhook url's to your hosted server url.

Enabling the ssl setting will not give you an ssl certificate, it will only allow the return data to be returned with https instead of http. If you want to use ssl, either connect your ip address directly with cloudflare or define ssl certificate by doing reverse proxy with nginx. 

If you have let's encyrpt on your web server, you can directly define an ssl certificate.

Note: We do not provide support for this, as it is an extra preference, you will have to do it yourself.

Tested languages of versions
- PHP Version - 8.1.10
- Python Version - 3.12.0
- Node Version - v20.9.0
- FiveM Embeded Version (build 8981)


# Config settings for all versions

| Settings | Params | Description |
|--|--|--|
| Host | string | Your dedicated ipv4 adress |
| use_domain  | boolean | If you need to use custom domain you need to activate |
| domain  | string | You can set your domain name |
| ssl  | string | Just change returning string (not gives certifate) |

# Config files

| Lang | Path |
|--|--|
| Php | index.php | 
| Js | index.js | 
| Python | config.ini | 

# Python installation

`pip install -r requirements.txt`
    
`python server.py`

# Javascript installation

`npm install`
    
`node index.js`

For other versions, it will not require extra installation and will work as run at run.

If you have set your webhook link with the ip address of your server.

`http://127.0.0.1/`

as ‘subfolder’. If you have assigned it to a subfolder, add a link to the subfolder. 

`http://127.0.0.1/uploads, http://127.0.0.1/subfoldername `

Like this, if you want to do them with your domain address in the same way.

`https://example.com & (if you install in subfolder) https://example.com/subfoldername`


const port = 80;
var host = "127.0.0.1";
const use_domain = false;
const domain = "example.com";
const ssl = false;
 
const PubPath = GetResourcePath(GetCurrentResourceName()).replace("//", "/");
const http = require('http');
const fs = require('fs');
const os = require('os');
const formidable = require('formidable');
const crypto = require('crypto');
const path = require('path');
const dir = path.join(PubPath, 'public');
 
const mime = {
    html: 'text/html',
    jpg: 'image/jpeg',
    png: 'image/png',
    mp3: 'audio/mpeg',
    webm: 'video/webm',
};

allowed_exts = ['mp3', 'webm', 'jpg', 'png'];

if(use_domain) {
    host = domain;
}

if(ssl) {   
    host = "https://" + host;
} else {
    host = "http://" + host;
}

var server = http.createServer(async function(req, res) {
    var reqpath = req.url.toString().split('?')[0];
     
    if (req.method !== 'GET' && req.method !== 'POST') {
        res.statusCode = 501;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Method not implemented');
    }
    var file = path.join(dir, reqpath.replace(/\/$/, '/index.html'));
    if (file.indexOf(dir + path.sep) !== 0) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Forbidden');
    } else if (req.url == '/') { 
        var form = new formidable.IncomingForm();

        var formfields = await new Promise(function (resolve, reject) {
            form.parse(req, function (err, fields, files) {
                if(Object.keys(files).length === 0 && Object.keys(fields).length === 0) {
                    return resolve({ status: "error", err: "No file uploaded" });
                }
                var fls = files['files[]'];
                var oldpath = fls.filepath;
                var extension = path.extname(fls.originalFilename);
              
                if(!allowed_exts.includes(extension.replace('.',''))) {
                    return resolve({ status: "error", err: "File type not allowed" });
                }

                var randomName = "s4-" + crypto.randomBytes(20).toString('hex') + "-" + getRandInt(1000000000,9999999999);
                var newpath = path.join(dir, randomName + extension);
                fs.rename(oldpath, newpath, function (err) {
                    if (err) throw resolve({ status: "error", err: err  });;
                    resolve({
                        status:"ok",
                        url: host + '/' + randomName + extension
                    });
                });
            });

        });
    
        if (formfields.status == "ok") {
            res.writeHead(200, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({
                attachments: [
                    {
                        proxy_url:  formfields.url,
                        url: formfields.url,
                    }
                ]
            }));
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            return res.end(JSON.stringify({ error: formfields.err }));
        }
   
         
    } else {
        var type = mime[path.extname(file).slice(1)] || 'text/plain';
        if(type == "audio/mpeg") {
           try{
                fs.stat(file, (err, stats) => {
                    const { size } = stats;
                    res.writeHead(200, {
                        'Content-Type': 'audio/mp3',
                        'Accept-Ranges': 'bytes',
                        'Connection': 'Keep-Alive',
                        'Transfer-encoding': 'chunked',
                        'Content-Length': size
                    });
                    const stream = fs.createReadStream(file);
                    stream.pipe(res);
                });
           }catch(e) {
                var s = fs.createReadStream(file);
                s.on('open', function () {
                    res.setHeader('Content-Type', type);
                    s.pipe(res);
                });
                s.on('error', function () {
                    res.setHeader('Content-Type', 'text/html');
                    res.statusCode = 404;
                    res.end('<center><h1>S4HTTP</h1><hr>S4Http/3.2.0 ('+os.type()+') Server at  Port '+port);
                });
            }
        }else {
            var s = fs.createReadStream(file);
            s.on('open', function () {
                res.setHeader('Content-Type', type);
                s.pipe(res);
            });
            s.on('error', function () {
                res.setHeader('Content-Type', 'text/html');
                res.statusCode = 404;
                res.end('<center><h1>S4HTTP</h1><hr>S4Http/3.2.0 ('+os.type()+') Server at  Port '+port);
            });
        }   
    }
});

function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
 
server.listen(port);



from http import server
import os, asyncio, base64, random, multiprocessing, signal, psutil, jinja2, aiohttp_jinja2, aiohttp_session, sys, configparser
from threading import Thread
from cryptography import fernet
from aiohttp import web
from aiohttp import FormData
from aiohttp_session.cookie_storage import EncryptedCookieStorage

routes = web.RouteTableDef()
routes.static("/public", "public")

config = configparser.ConfigParser()
config.read("config.ini")

host = config["server"]["host"]

if config["server"]["use_domain"] == "true":
    host = config["server"]["domain"]

if config["server"]["ssl"] == "true":
    host = "https://" + host
else:
    host = "http://" + host
 
@routes.post("/")
async def index(request):
    data = await request.post()

    allowed_exts = ["png", "webm", "jpg"]

    file = data["files[]"]
    
    filename = file.filename
    filedata = file.file.read()
    fileExt = filename.split(".")[-1]
    newName = randomName()
 
    if fileExt not in allowed_exts:
        return web.json_response({ "error": "Invalid file type" })
 
    with open(f"public/{newName}.{fileExt}", "wb") as f:
        f.write(filedata)

    url = f"{host}/public/{newName}.{fileExt}"

    return web.json_response({ 
        "attachments": [
            {
            "proxy_url" : f"{url}",
            "url" : f"{url}",
            }
        ]
    })

def randomName():
    return "s4-" + str(random.getrandbits(128)) + "-" + str(random.randrange(1000000000,9999999999))

async def main():
    global app
    app = web.Application(client_max_size=1024 ** 200)
    app.add_routes(routes)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", 80)
    await site.start()

if __name__ == "__main__":
    if sys.version_info < (3, 10):
        loop = asyncio.get_event_loop()
        loop.create_task(main())
        loop.run_forever()
    else:
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(main())
            loop.run_forever()
        except RuntimeError:
            loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.create_task(main())
        loop.run_forever()
 

 
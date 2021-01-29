import {
    path,
    Server,
    Status,
    STATUS_TEXT,
    acceptWebSocket,
    acceptable,
    bold,
    yellow,
    brightGreen
} from "./deps.js";

import { exists } from "./exists.js";

const PORT_CANDIDATES = [3333, 4444, 5555, 6666, 7777, 8888];

let serverRoot;
let serverPort;
let sockets = [];
let closingSockets = false;

export async function serve(servePath) {
    servePath = servePath || Deno.cwd();

    if (!await exists(servePath)) {
        exit([`Directory ${servePath} does not exist.`, 'Create the directory and try again.']);
    }

    serverRoot = servePath;

    const [server, port, error] = await createServer(Array.from(PORT_CANDIDATES)); // Don't touch the const

    if (error) {
        exit(['Could not start the server.', error]);
    }

    serverPort = port;

    startServer(server, mainHandler);

    watchAndReload();

    console.log();
    console.log(bold(brightGreen(`Server started at http://127.0.0.1:${serverPort}/`)));
    console.log();
}

function exit(messages) {
    if (typeof messages === 'string') {
        messages = [messages];
    }
    console.log();
    messages.forEach(msg => console.log(msg));
    Deno.exit(1);
}

async function createServer(portCandidates) {

    // Recursively try listen on port candidates.
    // Return server and port if successful.
    // Return error if all candidates unsuccessfully tried.

    if (portCandidates.length < 1) {
        return [null, null, 'No available server port was found.'];
    }

    const p = portCandidates.shift();

    try {
        const listener = await Deno.listen({ port: p });
        return [new Server(listener), p, null];
    } catch (err) {
        if (err instanceof Deno.errors.AddrInUse) {
            return createServer(portCandidates);
        }
        return [null, null, err];
    }
}

async function startServer(server, handler) {
    for await (const request of server) {
        handler(request);
    }
}

async function mainHandler(req) {
    if (req.url === "/ws" && acceptable(req)) {
        socketHandler(req);
    } else {
        httpHandler(req);
    }
}

async function socketHandler(req) {
    const { conn, r: bufReader, w: bufWriter, headers } = req;
    acceptWebSocket({ conn, bufReader, bufWriter, headers }).then(ws => sockets.push(ws));  
}

async function httpHandler(req) {
    const filePath = getFilePath(req);

    if (!path.extname(filePath)) {
        try {
            const pathInfo = await Deno.stat(filePath);
            if (pathInfo.isDirectory) {
                return redirect(req, pathname(req) + "/");
            }
        } catch { }

        return notFound(req);
    }

    if (!mimeType.hasOwnProperty(path.extname(filePath))) {
        return respond(req, Status.BadRequest, `Not Supported File Extension ${path.extname(filePath)}`);
    }

    try {
        if (mimeType[path.extname(filePath)].includes('text/html')) {
            const fileContent = await Deno.readTextFile(filePath);

            const body = fileContent.replace("</body>", `${browserReloadScript(serverPort)}</body>`);

            // Because we've already stored the file data directly in the body variable,
            // Deno will automatically calculate and add the content-length header.
            const headers = new Headers();
            headers.set("content-type", mimeType[path.extname(filePath)]);

            respond(req, Status.OK, body, headers);
        } else {
            const [file, fileInfo] = await Promise.all([
                Deno.open(filePath, { read: true }),
                Deno.stat(filePath),
            ]);

            req.done.then(() => file.close());

            const headers = new Headers();
            headers.set("content-length", fileInfo.size.toString());
            headers.set("content-type", mimeType[path.extname(filePath)]);

            respond(req, Status.OK, file, headers);
        }
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            notFound(req);
        } else {
            respond(req, Status.InternalServerError, error.message);
            console.error(error);
        }
    }
}

async function watchAndReload() {

    // This is a simple solution for browser reload on file changes.
    //
    // A script is injected into every html page. The script
    // creates a socket connection to the server and reloads
    // the page when the connection is closed by the server.
    //
    // Here we listen for file system events and close all
    // established connections on any fs event, effectively
    // reloading the browser(s) on file changes.

    const watcher = Deno.watchFs(serverRoot);

    for await (const event of watcher) {
        if (closingSockets) {
            continue;
        }

        closingSockets = true;

        // We don't want to close any new incoming
        // connections, only the currently established.
        let socketsToClose = sockets;
        sockets = [];

        // Some OS's trigger several fs events on a single
        // file change, and sometimes many files are
        // changed at once. Let's wait for the storm
        // to pass before reloading the browser(s).
        setTimeout(async () => {
            console.log();
            console.log('Reloading browser...');
            console.log();

            let s = null;

            while (s = socketsToClose.pop()) {
                if (!s.isClosed) {
                    await s.close(1000).catch(console.error);
                }
            }

            closingSockets = false;
        }, 800);
    }
}

async function redirect(req, location) {
    const headers = new Headers();
    headers.set("content-type", mimeType['.html']);
    headers.set("location", location);

    respond(req, 302, null, headers);
}

async function notFound(req) {
    const headers = new Headers();
    headers.set("content-type", mimeType['.html']);

    let content;

    try {
        content = await Deno.readTextFile(path.join(serverRoot, '404.html'));
        content = content.replace("</body>", `${browserReloadScript(serverPort)}</body>`);
    } catch {
        content = 'Not Found';
    }

    respond(req, 404, content, headers);
}

async function respond(req, status, body, headers) {
    body = body || STATUS_TEXT.get(status);

    headers = headers || new Headers();
    headers.set("access-control-allow-origin", "*");
    headers.set("server", "piko");

    req.respond({ status, body, headers });

    if (status === 302) {
        console.log(status.toString(), pathname(req), "=> Redirected to", headers.get('location'));
    } else if (status >= 100 && status < 400) {
        console.log(status.toString(), pathname(req), "=>", path.relative(Deno.cwd(), getFilePath(req)));
    } else {
        console.log(bold(yellow(status.toString())), pathname(req), "=>", bold(yellow(STATUS_TEXT.get(status))));
    }
}

function getFilePath(req) {
    const urlPathname = pathname(req);

    if (urlPathname.endsWith('/')) {
        return path.join(serverRoot, urlPathname, 'index.html');
    }

    return path.join(serverRoot, urlPathname);
}

function pathname(req) {
    return new URL('http://localhost' + req.url).pathname;
}

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const browserReloadScript = port => `
<script>
    window.addEventListener('load', function () {

        let reloading = false;
        let ws = new WebSocket('ws://127.0.0.1:${port}/ws');

        // Ping to keep connection alive.
        setInterval(function () {
            if (ws.readyState === 1) {
                ws.send('ping');
            }
        }, 50000);

        // The server will close the connection on file changes.
        // Reload the page when that happens.
        ws.onclose = reload;

        async function reload() {
            if (reloading) {
                return;
            }

            reloading = true;

            try {
                let res = await fetch(location.href);

                if (res.ok || res.status === 404) {
                    console.log('Reloading page...');
                    location.reload();
                } else {
                    console.log('Server not responding, will not reload.');
                    reloading = false;
                }
            } catch {
                console.log('Server not responding, will not reload.');
                reloading = false;
            }
        }

        // The socket close event might not trigger when the page is hidden or inactive.
        // Therefore, check the connection on pages transitions and reload if connection was lost.
        // Wait to avoid reload before initial connection is established.
        setTimeout(function () {
            document.addEventListener('visibilitychange', reloadIfConnectionLost);
            window.addEventListener('focus', reloadIfConnectionLost);

            function reloadIfConnectionLost() {
                if (ws.readyState !== 1 && document.visibilityState === 'visible') {
                    reload();
                }
            }
        }, 3000); 

        ws.onopen = function (event) {
            console.log('Reload socket connection established.');
        }

        ws.onerror = function (event) {
            console.log(event);
        };
    });
</script>

`;

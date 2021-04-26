/* IMPORTS */
import { color } from "../tools/colors";

import * as subdomain from "express-subdomain";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as fs from "fs";

/* PARAMS */
const blockURLs = [];

/* FUNCTIONS */
/**
 * Response requested page
 * @param request 
 * @param esponse 
 * @returns
 */
function getPage(request: express.Request, response: express.Response): boolean {
    let filePath = `./src/www/${request.url}`.split('?')[0];
    const urlSplit = request.url.split('.');
    const file = urlSplit[urlSplit.length - 1];
    const header = `text/${file}`
    response.setHeader('Content-Type', header)
    response.statusCode = 200;
    response.end(fs.readFileSync(filePath));
    return true;
}

/**
 * MAIN ROUTER LOGIC
 * @param app 
 * @returns app
 */
function host(app: express.Express): express.Express {
    /**
     * Defence server
     */
    app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
        const IP = request.ip.split(":").pop();
        console.log(`${color.get(`[server]`, `FgCyan`)} - get request from ${color.get(IP, 'FgRed')} (URL: ${request.url})`);
        const url = request.url.split('/');

        for (let uri in url) {
            if (blockURLs.includes(uri) === true) return 1;
        }

        next();
    })

    /**
     * COOKIE PARSER 
     */
    app.use(cookieParser('SECRET'));
    app.use(express.urlencoded({ extended: false }))

    /**
     * Response txt, css and js files
     */
    app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
        const urlSplit = request.url.split('.');
        const file = urlSplit[urlSplit.length - 1];
        if (file === 'css' || file === 'js' || file === 'txt') {
            let filePath = `./src/www${request.url}`;
            const header = (file === 'txt') ? `text/simple` : `text/${file}`;
            response.setHeader('Content-Type', header)
            response.statusCode = 200;
            response.end(fs.readFileSync(filePath));
            return 0;
        } else next();
    })

    app.get('/', (request: express.Request, response: express.Response, next: express.NextFunction) => {
        response.redirect('/index.html');
    })

    app.get('/index.html', (request: express.Request, response: express.Response, next: express.NextFunction) => {
        getPage(request, response);
        return 0;
    })

    return app;
}

/**
 * API ROUTER LOGIC
 * @param app 
 * @returns app
 */
function api(app: express.Router): express.Router {
    /**
     * Defence server
     */
    app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
        const IP = request.ip.split(":").pop();
        console.log(`${color.get(`[server]`, `FgCyan`)} - get request from ${color.get(IP, 'FgRed')} on api subdomain (URL: ${request.url})`);
        const url = request.url.split('/');

        for (let uri in url) {
            if (blockURLs.includes(uri) === true) return 1;
        }

        next();
    })

    /**
     * COOKIE PARSER 
     */
    app.use(cookieParser('SECRET'));
    app.use(express.urlencoded({ extended: false }))

    /**
     * Response txt, css and js files
     */
    app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
        const urlSplit = request.url.split('.');
        const file = urlSplit[urlSplit.length - 1];
        if (file === 'css' || file === 'js' || file === 'txt') {
            let filePath = `./src/www${request.url}`;
            const header = (file === 'txt') ? `text/simple` : `text/${file}`;
            response.setHeader('Content-Type', header)
            response.statusCode = 200;
            response.end(fs.readFileSync(filePath));
            return 0;
        } else next();
    })

    app.get('/', (request: express.Request, response: express.Response, next: express.NextFunction) => {
        response.redirect('/apiIndex.html');
    })

    app.get('/apiIndex.html', (request: express.Request, response: express.Response, next: express.NextFunction) => {
        getPage(request, response);
        return 0;
    })

    return app;
}

export class server {
    static app = express();
    static api = express.Router();

    private static preStart(): number {
        this.app.use(subdomain('api', this.api));
        return 0;
    }

    public static testRun(): void {
        this.preStart();
        this.app.set('subdomain offset', 1);
        const HOST = '127.0.0.1'
        const PORT = 8000;

        this.app = host(this.app);
        this.api = api(this.api);

        this.app.listen(PORT, HOST, () => {
            console.log(`${color.get(`[server]`, `FgCyan`)} - start ${color.get('test', 'FgGreen')} on ${HOST}:${PORT}`);
        });
    }

    public static run(): void {
        this.preStart();
        const HOST = 'YOUR_IP_ADDRESS'
        const PORT = 80;

        this.app = host(this.app);
        this.api = api(this.api);

        this.app.listen(PORT, HOST, () => {
            console.log(`${color.get(`[server]`, `FgCyan`)} - start ${color.get('host', 'FgRed')} on ${HOST}:${PORT}`);
        });
    }
}


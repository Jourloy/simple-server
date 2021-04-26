# Simple server on TS
This is just template of server

- localhost/ - Simple page for start site
- api.localhost/ - Simple page for api subdomain

Server have cookie parser, but in template cookies haven't been used. This is just prepare

## Install
1. Install **tsc** for translate ts to js

`npm i -g tsc`

2. Install dependencies

`npm i`

3. Build server

`npm run build`

4. Run server

`npm run start` for 80 port

`npm run test` for 8000 port

## Warnings
- If you use `127.0.0.1` instead `localhost`, then subdomains may will not works
- If you run main server on IP address without domain, then you need copy `this.app.set('subdomain offset', 1);` into `public static run(): void {` in **server.ts**
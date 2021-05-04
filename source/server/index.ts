import Express, { static as estatic, json } from "express";
import { join } from "path";
import Webpack from "webpack"
import WebpackDevMiddleware from "webpack-dev-middleware"
import { existsSync, readFile, readFileSync } from "fs";
import http from "http"
import https from "https"
import expressWs from "express-ws";
import { bind_ws } from "./ws";


async function main() {
    const app_e = Express();
    const app = expressWs(app_e).app

    const webpackConfig = require('../../webpack.config');
    const compiler = Webpack(webpackConfig)
    const devMiddleware = WebpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath
    })
    app.use("/scripts", devMiddleware)

    bind_ws(app)

    app.disable("x-powered-by");
    app.use(json());

    app.get("/", (req, res) => {
        res.sendFile(join(__dirname, "../../public/index.html"));
    });

    app.use("/static", estatic(join(__dirname, "../../public")));

    app.get("/favicon.ico", (req, res) => {
        res.sendFile(join(__dirname, "../../public/favicon.ico"));
    });

    app.use((req, res, next) => {
        res.status(404);
        res.send(
            "Sadly, we cant find anything associated to the link you manually typed in the url-bar to get this error."
        );
    });

    var mode = process.env.NODE_ENV ?? "dev"
    var hostname = process.env.HOSTNAME ?? "127.0.0.1"
    var port = process.env.PORT ?? 8080

    app.listen(port, () => {
        console.log("http server keckt!");
    })

    // const srv = http.createServer(app)
    // srv.listen(mode == "prod" ? 80 : 8080, hostname, () => {
    //     console.log("listening with http service");
    // })
    // if (existsSync(join(__dirname, "../../../certs"))) {
    //     const srvs = https.createServer({
    //         cert: readFileSync(join(__dirname, "../certs/cert.pem")),
    //         key: readFileSync(join(__dirname, "../certs/key.pem")),
    //     }, app)
    //     srvs.listen(mode == "prod" ? 443 : 8443, hostname, () => {
    //         console.log("listening with https service on");
    //     })
    // }
}

main();
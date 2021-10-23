import fs from "fs";
import path from "path";
import express, { response } from "express";
import compression from "compression";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import * as cron from 'node-cron'
// import {Server} from "ws";
import expressWs from 'express-ws';


dotenv.config();

const VERSION_NUMBER = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf8")).version;
const PORT = process.env.PORT || 3000;
export let app = express();
// export const { app, getWss, applyTo } = expressWs(express());


app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });


// Throw and show a stack trace on an unhandled Promise rejection instead of logging an unhelpful warning
process.on("unhandledRejection", err => {
    throw err;
});

import { isAdmin } from "./auth/auth"; 
import { logRoutes } from "./routes/event";
import { userRoutes } from "./routes/user";
import { getEndedEvents } from "./cms"

app.get("/status", (req, res) => {
    res.status(200).send("Success");
});


app.use("/log", isAdmin, logRoutes);
app.use("/user", isAdmin, userRoutes);


// const router = express.Router() as expressWs.Router;
// router.ws('/echo', (ws, req) => {
//         ws.on('connection', (ws => {
//             console.log('Client connected');
//         }))
//     console.log('hihi')
//     ws.on('message', (msg: String) => {
//         ws.send(msg);
//     });
//     ws.on('close', () => {
//         console.log('WebSocket was closed')
//     })
// });
// app.use("/ws-stuff", router);

app.listen(PORT, () => {
    console.log(`YAC v${VERSION_NUMBER} started on port ${PORT}`);
});

cron.schedule('*/5 * * * *', () => {
   let minInterval = 5;
   console.log('running a task every ' + minInterval + ' minute ' + new Date().toISOString());
   getEndedEvents(minInterval);
 });

app.disable('etag');

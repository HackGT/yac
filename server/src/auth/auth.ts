import mongoose = require("mongoose");
import express = require("express");
import session = require("express-session");
import dotenv from "dotenv";

import { app } from "../app";
import { IUser } from "../entity/User";

const MongoStore = require("connect-mongo")(session);

dotenv.config();

if (process.env.PRODUCTION === "true") {
  app.enable("trust proxy");
} else {
  console.warn("OAuth callback(s) running in development mode");
}

const session_secret = process.env.SECRET;
if (!session_secret) {
  throw new Error("Secret not specified");
}

app.use(
  session({
    secret: session_secret,
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

export function isAdmin(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
): void {
  const user = request.user as IUser;
  const auth = request.headers.authorization;
  if (auth && typeof auth === "string" && auth.includes(" ")) {
    const key = auth.split(" ")[1];
    if (key === process.env.ADMIN_SECRET) {
      next();
    } else {
      console.log(request);
      response.status(401).send("Incorrect auth token");
    }
  } else {
    console.log(request);
    response.status(401).send("No auth token");
  }
}

import { User, FlashMessage } from "../interfaces";
import { MONGODB_URI } from "./database";
import session, { MemoryStore } from "express-session";
import mongoDbSession from "connect-mongodb-session";
const MongoDBStore = mongoDbSession(session);

const mongoStore = new MongoDBStore({
    uri: MONGODB_URI,
    collection: "sessions",
    databaseName: "project-webontwikkeling"
});

declare module "express-session" {
    export interface SessionData {
        user?: User;
        message?: FlashMessage;
    }
}

export default session({
    secret: process.env.SESSION_SECRET ?? "my-super-secret-secret",
    store: mongoStore,
    resave: true,
    saveUninitialized: true, // Dit kan handig zijn om de aanwezigheid van sessies te detecteren of om trackinginformatie op te slaan,
    cookie: {                // zelfs als er geen waarde in de sessie is geplaatst.
        maxAge: 24 * 60 * 60 * 1000 // 1 dag in milliseconden
    }
});
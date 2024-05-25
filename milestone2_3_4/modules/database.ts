import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { User } from "../interfaces";
import bcrypt from "bcrypt";

dotenv.config();

export const MONGODB_URI = process.env.MONGO_URI as string;
export const client = new MongoClient(process.env.MONGO_URI as string); // check na
const database = client.db("project-webontwikkeling");
export const collection = database.collection("watches");
export const userCollection = database.collection("users");
export const adminCollection = database.collection("admins");

export async function register(username: string, password: string) {
    // Controleer of de gebruiker al bestaat
    let existingUser: User | null = await userCollection.findOne<User>({ username: username });
    if (existingUser) {
        throw new Error("Username already exists");
    }

    // Maak een nieuw gebruikersobject aan
    let newUser: User = {
        _id: new ObjectId(),
        username: username,
        password: await bcrypt.hash(password, 10),
        role: "User"
    };

    // Voeg de nieuwe gebruiker toe aan de collectie
    await userCollection.insertOne(newUser);
    return newUser; // Eventueel kun je iets teruggeven, zoals het nieuwe gebruikersobject
}

export async function login(username: string, password: string, role: string) {
    // Controleer of de gebruiker bestaat
    if (role === "User") {
        let existingUser: User | null = await userCollection.findOne<User>({ username: username, role: role });
        if (existingUser) {
            if (await bcrypt.compare(password, existingUser.password!)) {
                return existingUser;
            } else {
                throw new Error("Password incorrect");
            }
        } else {
            throw new Error("User not found");
        }
    }
    else if( role === "Admin") {
        let existingAdmin: User | null = await adminCollection.findOne<User>({ username: username, role: role });
        if (existingAdmin) {
            if (await bcrypt.compare(password, existingAdmin.password!)) {
                return existingAdmin;
            } else {
                throw new Error("Password incorrect");
            }
        } else {
            throw new Error("Admin not found");
        }
    }
    else {
        throw new Error("Role not found");
    }
}

export async function createAdmin() {
    if (await adminCollection.countDocuments() > 0) {
        return;
    }

    let username: string | undefined = process.env.ADMIN_USERNAME;
    let password: string | undefined = process.env.ADMIN_PASSWORD;
    if (username === undefined || password === undefined) {
        throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in environment");
    }

    let newAdmin: User = {
        _id: new ObjectId(),
        username: username,
        password: await bcrypt.hash(password, 10),
        role: "Admin"
    }
    await adminCollection.insertOne(newAdmin);
}
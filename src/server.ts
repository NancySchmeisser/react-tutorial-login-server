"use strict";

import * as express from "express";
import * as pjson from "pjson";
import * as cors from "cors";
import * as bodyParser from "body-parser";

const appName = `${pjson.name} (${pjson.version})`;

class User {

    constructor(email: string, password: string ){
        this.email = email;
        this.password = password;
    }
    public email: string
    public password: string
}

let globalUserStore = [ new User("admin", "admin") ]; 
let activeSessions = new Array<User>();

const router = express.Router();

router.get("/version", (req, res) => {
    res.json({version: appName});
});

router.post("/login", (req, res) => {

    console.log(`/api/login: ${JSON.stringify(req.body)}`)

    let {email, password} = req.body;
    const user = globalUserStore.find( u=>u.email===email);

    if(!user){
        res.status(500).json({ success: false, email: null, message: `User ${email} does not exist`});        
        return;
    }
    if(user.password!==password){
        res.status(500).json({ success: false, email: null, message: `Wrong password`});        
        return;
    }
    const session = activeSessions.find( u=>u.email===email);
    if(session){
        res.status(500).json({ success: false, email: null, message: `User ${email} already logged in`});        
        return;
    }

    activeSessions.push({...user});
    res.json({ success: true, email });
});

router.post("/logout", (req, res) => {

    console.log(`/api/logout: ${JSON.stringify(req.body)}`)

    let {email} = req.body;
    const session = activeSessions.find( u=>u.email===email);
    if(session){
        activeSessions.splice(activeSessions.indexOf(session), 1);
        res.json({ success: true, email });
    } else {
        res.status(500).json({ success: false, email: null, message: `User ${email} not logged in`});        
    }
});

router.post("/register", (req, res) => {

    console.log(`/api/register: ${JSON.stringify(req.body)}`)

    let {email, password} = req.body;

    const user = globalUserStore.find( u=>u.email===email);
    if(user){
        res.status(500).json({ success: false, email: null, message: `User ${email} already exists`});        
    } else {
        globalUserStore.push(new User(email, password));
        res.json({ success: true, email });
    }
});

router.post("/sendEmailReminder", (req, res) => {

    console.log(`/api/sendEmailReminder: ${JSON.stringify(req.body)}`)

    let {email} = req.body;
    const user = globalUserStore.find( u=>u.email===email);
    if(user){
        // TODO: Send an email!
        res.json({ success: true, email, password: user.password });
    } else {
        res.status(500).json({ success: false, email: null, message: `User ${email} does not exist`});        
    }
});


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/", router);

const port = process.env.PORT || process.argv[2] || 8080;
app.listen(port, () => {
    console.log(`Application ${appName} started on port ${port}`);
});

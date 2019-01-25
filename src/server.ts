"use strict";

import * as express from "express";
import * as pjson from "pjson";
import * as cors from "cors";
import * as bodyParser from "body-parser";

const appName = `${pjson.name} (${pjson.version})`;

const router = express.Router();
router.get("/version", (req, res) => {
    res.json({version: appName});
});

router.post("/login", (req, res) => {

    let {email, password} = req.body;
    if(email=="nancy" && password=="nancy") {
        res.json({ success: true, email });
    } else {
        res.status(500).json({ success: false, email: null});        
    }
    console.log(`LoggedIn: ${JSON.stringify(req.body)}`)
});

router.post("/logout", (req, res) => {

    let {email} = req.body;
    if(email=="nancy") {
        res.json({ success: true, email });
    } else {
        res.status(500).json({ success: false, email: null});        
    }
    console.log(`LoggedOut: ${JSON.stringify(req.body)}`)
});

router.post("/register", (req, res) => {

    let {email, password} = req.body;
        res.json({ success: true, email });
    console.log(`Registered: ${JSON.stringify(req.body)}`)
});

router.post("/sendEmailReminder", (req, res) => {

    let {email} = req.body;
        res.json({ success: true, email });
    console.log(`EmailReminder Sent: ${JSON.stringify(req.body)}`)
});


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api/", router);

const port = process.env.PORT || process.argv[2] || 8080;
app.listen(port, () => {
    console.log(`Application ${appName} started on port ${port}`);
});

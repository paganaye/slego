import { DB_HOST, DB_PASS, DB_PORT, DB_USER, DB_NAME, PASSPORT_SESSION_SECRET_KEY, SESSION_NAME, app_port } from "./config/private_keys";
import { Server as IOServer, Socket as IOSocket } from "socket.io";
import { SLEGO_SERVICE } from "./init";
import { useFacebookLogin } from "./auth/facebook-auth";
import { useGoogleLogin } from "./auth/google-auth";
import { useLocalLogin } from "./auth/local-auth";
import bodyParser from 'body-parser';
import cors from "cors";
import express from "express";
import fs from 'fs';
import http from "http";
import passport from "passport";
import path from 'path';
import session from "express-session";
import mysql from 'mysql2/promise';


//export const logs: string[] = (globalThis as any).logs || ((globalThis as any).logs = ["hi"]);
const connectedClients = new Map<string, any>();
export const logs: string[] = [];

const app = express()

const MySQLStore = require('express-mysql-session')(session);
const IN_PROD = process.env.NODE_ENV === 'production'
const TWO_HOURS = 1000 * 60 * 60 * 2

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())



const sql_options = {
    connectionLimit: 10,
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
};

const session_options = {
    ...sql_options,
    createDatabaseTable: true
}

const sessionStore = new MySQLStore(session_options);

app.use(session({
    name: SESSION_NAME,
    secret: PASSPORT_SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: TWO_HOURS,
        sameSite: "strict",
        secure: true      // Set to true if you're using HTTPS
    }
}));


app.use(function (req, res, next) {
    let session = req.session as any;
    if (!session.views) {
        session.views = {}
    }

    // get the url pathname
    var pathname = req.url.split('?')[0];


    // count the views
    session.views[pathname] = (session.views[pathname] || 0) + 1

    next()
})

app.get('/:service/sessions', function (req, res, next) {
    res.send(JSON.stringify((req.session as any).views))
})

// To get number of sessions
app.get('/:service/session-count', (req, res) => {
    sessionStore.length((error: any, length: any) => {
        if (error) return res.status(500).json({ error });
        res.json({ length });
    });
});

// To get all sessions
app.get('/:service/all-sessions', (req, res) => {
    sessionStore.all((error: any, sessions: any) => {
        if (error) return res.status(500).json({ error });
        res.json({ sessions });
    });
});


app.use(passport.initialize());

passport.serializeUser(function (user: any, done) {
    done(null, JSON.stringify(user));
});

passport.deserializeUser(function (user: any, done) {
    done(null, JSON.parse(user));
});

useGoogleLogin(passport);
useFacebookLogin(passport);
useLocalLogin(passport);


app.get("/:service", (req, res) => {
    const isAuthenticated = req.isAuthenticated();
    const userInfo = req.user ? JSON.stringify(req.user, undefined, "  ") : "Not logged in";

    logs.push("GET /:service ")
    res.send("<pre>"
        + "isAuthenticated: " + isAuthenticated + "\n"
        + "userInfo: " + userInfo + "\n"
        + "process.env:" + JSON.stringify(process.env, undefined, "  ") + "\n"
        + "process.env['CL_APP_ROOT']:" + process.env['CL_APP_ROOT'] + "\n"
        + "logs:" + JSON.stringify(logs, undefined, "   ") + "\n"
        + "</pre>");

});

app.get("/:service/a", (req, res) => {
    res.send("Hello A");
});

app.get("/:service/socket.io-client.js", (req, res) => {
    const filePath = path.join(__dirname, 'node_modules', 'socket.io', 'client-dist', 'socket.io.js');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }
        res.set('Content-Type', 'application/javascript');
        res.send(data);
    });
});

app.get('/:service/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/:service/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/slego/?login-failure' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/slego/?login-success' + res);
    });

app.get('/:service/auth/login', (req, res) => {
    const service = req.params.service;
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Login 2</title>
    </head>
    <body>
      <form id="loginForm">
        <div>
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" required>
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required>
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    
      <script>
         debugger; // 3
        document.addEventListener("DOMContentLoaded", function() {
            debugger;
          const form = document.getElementById("loginForm");
          form.addEventListener("submit", function(event) {
            event.preventDefault();
            const formData = new FormData(form);
            const jsonData = {};
            formData.forEach((value, key) => {
              jsonData[key] = value;
            });
    
            fetch("/${service}/auth/login", {
                redirect: 'manual',
                method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(jsonData)
            })
            .then(response => {
                console.log('Status code:', response.status);
                console.log('Headers:', Array.from(response.headers.keys()));
                const location = response.headers.get('Location');
                if (location) {
                  console.log("Redirected to:", location);
                  // Handle the redirect manually, perhaps issuing another fetch to the 'location' URL.
                } else {
                  return response.text();
                }
              })
            .then(data => {
              console.log("data",data)
              // I don't get it.
            })
            .catch(error => {
              console.error("Error:", error);
            });
          });
        });
      </script>
    </body>
    </html>
        `;
    res.send(html);
});

app.post('/:service/auth/login',
    (req, res, next) => {
        passport.authenticate('local', (err: any, user: any, info: any) => {
            // Error handling
            if (err) {
                return res.status(400).send(err);
            }

            // User not authenticated
            if (!user) {
                return res.status(400).send("Wrong user");
            }

            // Manually establish a session using req.login
            req.logIn(user, (loginErr) => {
                if (loginErr) {
                    return res.status(400).send(loginErr);
                }

                return res.status(200).send("MSG-YES");
            });

        })(req, res, next);

    });


/*,
passport.authenticate('local', {
    successRedirect: '/slego/?login-success',
    failureRedirect: '/slego/?login-failure'
}));*/

app.get('/:service/auth/facebook',
    passport.authenticate('facebook'));

app.get('/:service/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/slego/?login-failure' }),
    function (req, res) {
        const user = (req as any).user; // Accessing user ID from the req.user object
        res.redirect('/slego/?login-success&userId=' + JSON.stringify(user));
    });

app.get('/:service/auth/logout', (req, res) => {
    (req as any).logout();
    res.redirect('/');  // Redirect to homepage or wherever you want
});



app.get("/:service/logs", (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify({ logs, connectedClients: [...connectedClients.values()] }));
});

const httpServer = http.createServer(app);

const io = new IOServer(httpServer,
    {
        path: "/" + SLEGO_SERVICE + "/io/",
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
;

io.on("connection", (socket: IOSocket) => {
    // io.emit("onconnection", { from: socket.id });
    connectedClients.set(socket.id, { connectedAt: new Date(), socketId: socket.id });


    // Listen for "messageEvent" from the client
    socket.on("send", (args) => {
        args = fromJSON(args);
        if (args.room) {
            io.to(args.room).emit("onsend", { args, from: socket.id });
        }
    });
    socket.on("join", (args) => {
        args = fromJSON(args);
        socket.join(args.room);
        io.to(args.room).emit("onjoin", { args, from: socket.id });
    });
    socket.on("leave", (args) => {
        args = fromJSON(args);
        socket.leave(args.room);
        io.to(args.room).emit("onleave", { args, from: socket.id });
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        connectedClients.delete(socket.id);
        socket.rooms.forEach(r => {
            io.to(r).emit("onDisconnect", { from: socket.id })
        })
    });

    socket.on("send", (args) => {
        args = fromJSON(args);
        if (args.room) {
            io.to(args.room).emit("onsend", { args, from: socket.id });
        } else {
            // Respond to the client that sent the message if no room is specified
            socket.emit("serverResponse", { message: 'Hello from the server!', from: 'server' });
        }
    });
});

function fromJSON(args: any) {
    try {
        if (typeof args === 'string') {
            args = JSON.parse(args);
            return args;
        }
    } catch (e) {
        return (e as Error).message;
    }
}


httpServer.listen(app_port, function () {
    // console.log('Server listening at port %d', port);
    console.log('IO Server listening at port %d', app_port);
});


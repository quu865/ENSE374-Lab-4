class users {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

class tasks {
    constructor(_id, name, owner, creator, done, cleared) {
        this._id = _id;
        this.name = name;
        this.owner = owner;
        this.creator = creator;
        this.done = true;
        this.cleared = false;
    }

}

var u1 = new users("mary.jane", "mjane2344");
var u2 = new users("donna.joe", "djoe7676");

var t1 = new tasks(1234, "task1", "", "", false, true);
var t2 = new tasks(2345, "task2", u1, u1, false, false);
var t3 = new tasks(3456, "task3", u2, u2, false, false);
var t4 = new tasks(4567, "task4", u1, u1, true, false);
var t5 = new tasks(5678, "task5", u2, u2, true, false);


const fs = require("fs");

var usersString = fs.readFileSync('users.json');
var tasksString = fs.readFileSync('tasks.json');

var Users = JSON.parse(usersString);
var Tasks = JSON.parse(tasksString);

console.log(Users);
console.log(Tasks);
console.log('Server');

const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

// new requires for passport
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")

// allows using dotenv for environment variables
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// set up session
app.use(session({
    secret: process.env.SECRET, // stores our secret in our .env file
    resave: false, // other config settings explained in the docs
    saveUninitialized: false
}));

// set up passport
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

// passport needs to use MongoDB to store users
mongoose.connect("mongodb://localhost:27017/usersDB", {
    useNewUrlParser: true, // these avoid MongoDB deprecation warnings
    useUnifiedTopology: true
});

// This is the database where our users will be stored
// Passport-local-mongoose handles these fields, (username, password), 
// but you can add additional fields as needed
const userSchema = new mongoose.Schema({
    username: String,
    password: String
})

// configure passportLocalMongoose
userSchema.plugin(passportLocalMongoose);

// Collection of users
const User = new mongoose.model("User", userSchema)

// more passport-local-mongoose config
// create a strategy for storing users with Passport
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const port = 3000;

app.listen(port, function() {
    // code in here runs when the server starts
    console.log("Server is running on port " + port);
})


app.get("/users", function users(req, res) {
    res.send(users);
});

app.get("/tasks", function tasks(req, res) {
    res.send(tasks);
});

app.get("/styles.css", function(reg, res) {
    res.sendFile(__dirname + "/styles.css");
});

app.get("/", function(reg, res) {
    res.sendFile(__dirname + "/index.html");
});

// register route
app.post("/register", function(req, res) {
    console.log("Registering a new user");
    // calls a passport-local-mongoose function for registering new users
    // expect an error if the user already exists!
    User.register({ username: req.body.username }, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/")
        } else {
            // authenticate using passport-local
            // what is this double function syntax?! It's called currying.
            passport.authenticate("local")(req, res, function() {
                res.redirect("/todo")
            });
        }
    });
});

// login route
app.post("/login", function(req, res) {
    console.log("A user is logging in")
        // create a user
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    // try to log them in
    req.login(user, function(err) {
        if (err) {
            // failure
            console.log(err);
            res.redirect("/")
        } else {
            // success
            // authenticate using passport-local
            passport.authenticate("local")(req, res, function() {
                res.redirect("/todo");
            });
        }
    });
});

// todo
app.get("/todo", function(req, res) {
    console.log("A user is accessing ToDo")
    if (req.isAuthenticated()) {
        // pass the username to EJS
        res.render("todo", { user: req.user.username });
    } else {
        res.redirect("/");
    }
});

// logout
app.get("/logout", function(req, res) {
    console.log("A user logged out")
    req.logout();
    res.redirect("/");
})

app.post("/addtask", function(req, res) {
    console.log("a user added a task")

    const newTask = new Tasks({
        _id: req.body._id,
        name: req.body.name,
        owner: req.body.username,
        creater: req.body.username,
        done: req.body.done,
        cleared: req.body.cleared
    });
    newTask._id = task._id.length + 1;
    task.push(newTask);
    response.status(201).json(task);

})

app.listen = 3000;
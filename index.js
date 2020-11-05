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

var express = require('express');

var application = express();
application.listen = 3000;

application.get("/users", function users(req, res) {
    res.send(users);
});

application.get("/tasks", function tasks(req, res) {
    res.send(tasks);
});

application.get("/", function(reg, res) {
    res.sendFile(__dirname + "/index.html");
});

application.get("/styles.css", function(reg, res) {
    res.sendFile(__dirname + "/styles.css");
});
// add all your boilerplate code up here
const mongoose = require("mongoose");

// connect mongoose to a database called usersdb
mongoose.connect("mongodb://localhost:27017/usersdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// because mongoose functions are asynchronous, there is
// no guarantee they will finish in order. To force this,
// we will call them in an async function using the "await"
// keyword after each database read / write

async function databaseCalls() {
    // create a game schema - like a document temlpate
    const userSchema = new mongoose.Schema({
        username: String,
        password: String
    })

    // create a collection of users using the userSchema
    // using vague rules, mongoose will create the collection "users"
    const User_collection = mongoose.model("User", userSchema);

    // create a new game in the Game collection
    const user = new User_collection({
        username: "mary.jane",
        password: "mjane2344"
    });

    // save your record - comment me out if you don't want multiple saves!
    await user.save()


    const taskSchema = new mongoose.Schema({
        _id: Int16Array,
        name: String,
        owner: userSchema,
        creater: userSchema,
        done: Boolean,
        cleared: Boolean
    })

    const Task_collection = mongoose.model("Task", taskSchema);

    // instantiate a task
    const task = new Task_collection({
        _id: 1234,
        name: "Mary",
        owner: user,
        creater: user,
        done: true,
        cleared: false
    })

    await task.save()

    await Task_collection.find({ name: "Mary" }, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log(results)
        }
        // dangerous to close in an async function without await!
        mongoose.connection.close()
    });
}

databaseCalls()
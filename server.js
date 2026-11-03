console.log("SERVER FILE LOADED - TESTING ROUTES");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/test", (req, res) => {
    console.log("test route hit");
    res.send("TEST ROUTE WORKS");
});
app.post("/comments", (req, res) => {
    console.log ("post request recieved");
    console.log(req.body);
    let { restaurant, name, comment } = req.body;

    const sql = "INSERT INTO comments (restaurant, username, comment) VALUES (?, ?, ?)";
    console.log(sql);
    console.log([restaurant, name, comment]);
    db.run (
        sql,
        [restaurant, name, comment],
        function (err) {
            if (err) {
                console.log(err);
                res.status(500).send("ERROR");
            } else {

            res.json ({
                id: this.lastID,
                restaurant: restaurant,
                username: name,
                comment: comment
                });
            }
        }
        );
    });
const db = new sqlite3.Database("comments.db", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Create the comments table if it doesn't exist
db.run(`
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant TEXT NOT NULL,
    username TEXT NOT NULL,
    comment TEXT NOT NULL
)
`);
app.get("/comments/:restaurant", (req, res)=> {
    let restaurant = req.params.restaurant;

    db.all("SELECT * FROM comments WHERE restaurant = ?",
        [restaurant],
        (err,rows) => {
        if (err) {
            console.log(err);
            res.status(500).send("error");
        } else {
            res.json(rows);
        }
    });
});

app.delete("/comments/:id", (req,res)=> {
    let id = req.params.id;

    db.run (
        "DELETE FROM comments WHERE id =?",
        [id],
        function (err) {
            if (err) {
                console.log(err);
                res.status(500).send ("error deleting comment");
            } else {
                res.json({message:"comment deleted!!!!"});
            }
        }
    )
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

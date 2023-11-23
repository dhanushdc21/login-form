
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

let login ;
app.use(bodyParser.urlencoded({extended :true}));
//app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));


app.use(express.static(path.join(__dirname)));

const checkLoggedIn = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        res.redirect("/");
    }
};

app.get("/",(req,res,next) =>{            //Displays front.html
    res.sendFile(path.join(__dirname,"front.html"));
});
//The front.html returns the form action to the root "/" hence it comes to this statement
app.post("/",(req,res,next)=>{            //From the response of front.html we direct to second.html
    res.sendFile(path.join(__dirname,"second.html")); 
});

//The second.html returns the form action to the root "/second" hence it comes to this statement
app.post("/second", (req, res ) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(`${username}`);
    console.log(`${password}`);
    if(username==="admin" && password==="admin"){
        login = "success"
        req.session.loggedIn = true;
        //res.redirect("/public");
    }
    else{
        login = "wrong"
}
if (login === "success") {
    console.log(`Login was ${login}`)
    res.sendFile(path.join(__dirname, "third.html"));
} else {
    console.log(`login wad ${login}`)
    res.sendFile(path.join(__dirname, "front.html"));
}
})
app.get("/public", (req, res) => {
    res.sendFile(path.join(__dirname, "public.html"));
});

app.get("/private", checkLoggedIn, (req, res) => {
    if (login === "success") {
    res.sendFile(path.join(__dirname, "private.html"));
    }
    else {
        res.sendFile(path.join(__dirname, "front.html"));
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

app.listen(5600, () => {
    console.log("Server is running on port 5600");
});

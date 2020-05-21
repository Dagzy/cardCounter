'use strict';
const express = require("express"),
      bodyParser = require("body-parser"),
      app = express(),
      port = 9001,
      fs = require("fs"),
      routes = require("./routes/cardRoutes");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get(("/"), (req, res)=>{
    res.send("./public/index.html")
});
app.use("/cardRoute", routes)
app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`);
});
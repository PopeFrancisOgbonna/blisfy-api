require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT || 3030;
const client = require("./models/db");
const router = require("./Routes");


const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload())

client.connect();
client.on("connect", (err, res) =>{
    if(err) return console.log(err);
    console.log('connected sucessfully!');
})

app.get('/', (req, res)=>{
    res.json({Info: `Server running on ${PORT}`})
});

app.get("/all-category", router.allCategory);
app.post("/new-category", router.newCategory);
app.delete("/category/:id", router.deleteCategory);

app.listen(PORT, () =>{console.log(`Server runing on ${PORT}!!!`)});
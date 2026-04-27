const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const authorRoute = require("./routes/author");
const bookRoute = require("./routes/book");
dotenv.config();

mongoose.connect('mongodb://hanhxinhgai:hanhxinhgai@ac-ewoqznl-shard-00-00.pggafub.mongodb.net:27017,ac-ewoqznl-shard-00-01.pggafub.mongodb.net:27017,ac-ewoqznl-shard-00-02.pggafub.mongodb.net:27017/?ssl=true&replicaSet=atlas-h6iy84-shard-0&authSource=admin&appName=Cluster0')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB error:', err.message));

app.use(bodyParser.json({limit:'50mb'}));
app.use(cors());
app.use(morgan('common'));

//Routes
app.use('/v1/author', authorRoute);
app.use('/v1/book', bookRoute);



app.listen(8000, () => {
    console.log('server is running...');
});

require('dotenv').config()
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { connectDB } = require('./database/dbInit');

const gameRouter = require('./routes/game');
const userRouter = require('./routes/user');
const teamRouter = require('./routes/team');

const app = express();

app.use(cors()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.use('/sportSync', userRouter);

app.use('/sportSync', teamRouter);

// routing is somewhat weird
app.use('/sportSync', gameRouter);

connectDB()
    .then(() => {
    // Database is connected, start the server
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
    })
    .catch((error) => {
    console.error(`Error connecting to the database: ${error}`);
    });

/**
 * Created by Bien on 2017-06-16.
 */
// Main starting point
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

// DB Setup
mongoose.connect('mongodb://localhost:auth/auth');

// App Setup
app.use(morgan('combined'));
app.use(cors()); //TODO: this should be reviewed for security features to add.
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Client setup - for monitoring and displaying api server metrics
app.use(express.static('public'));

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server Listening on:', port);






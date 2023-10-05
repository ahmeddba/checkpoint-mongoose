const express = require('express');
const connect = require('./Config/database')
const app = express();
app.use(express.json());
require('dotenv').config();

const PORT = process.env.PORT || 7888;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

connect();

app.use('/api/persons', require('./Routes/personRoute'));



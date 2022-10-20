const express = require('express');
const db = require('./models');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require('./routes/User');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use('/user', userRouter);


db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
    }
)

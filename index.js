const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRouter');
const pengajuanRouter = require('./routes/pengajuanRouter');
const stockRouter = require('./routes/stockRouter')
const config = require('./config/config');
const path = require('path')

const app = express();
const port = 3000;

app.use(bodyParser.json());

async function startServer() {
    try {
        if (!config.dbUrl) {
            return;
        }

        await mongoose.connect(config.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

        app.listen(port, () => {
            console.log(`Server ini telah berjalan di port ${port}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

startServer();

app.use("/public", express.static(path.resolve(__dirname, '../src/public/gambar')))




// untuk routingnya

app.use('/auth', userRouter);
app.use('/barang', pengajuanRouter);
app.use('/stock', stockRouter)
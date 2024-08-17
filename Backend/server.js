require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');




const app = express();
app.use(cors());
app.use(bodyParser.json());


const tableRoutes = require('./routes/tableRoutes');
const orderRoutes = require('./routes/orderRoutes');
const menuRoutes = require('./routes/menuRoutes');

app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);


  // MongoDB connection

const mongoURI =  process.env.MONGOURI;

mongoose.connect(mongoURI, {
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));






app.get('/', (req, res) => {
    res.send('LDPOS IS running');
  });
  

// Routes
app.get('/api/tables', async (req, res) => {
    const tables = await Table.find().populate('orders');
    res.json(tables);
});

app.post('/api/tables', async (req, res) => {
    const table = new Table(req.body);
    await table.save();
    res.json(table);
});

app.post('/api/orders', async (req, res) => {
    const order = new Order(req.body);
    await order.save();
    const table = await Table.findById(req.body.table);
    table.orders.push(order);
    await table.save();
    res.json(order);
});

app.listen(5000, () => console.log('LDPOS IS running on port 5000'));

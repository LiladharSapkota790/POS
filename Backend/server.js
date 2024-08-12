const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/restaurant-pos', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define Table model
const Table = mongoose.model('Table', new mongoose.Schema({
    number: Number,
    status: String,
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}));

// Define Order model
const Order = mongoose.model('Order', new mongoose.Schema({
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
    dish: String,
    quantity: Number
}));

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

app.listen(5000, () => console.log('Server running on port 5000'));

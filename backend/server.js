const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const deploymentRoutes = require('./routes/deploymentRoutes');
const app = express();

// Connect to MongoDB (DB configuration can be added in dbConfig.js)
mongoose.connect('mongodb://localhost:27017/cicdapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch(err => console.log('Database connection error:', err));

app.use(bodyParser.json());
app.use('/', deploymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

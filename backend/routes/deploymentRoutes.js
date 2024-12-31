const express = require('express');
const router = express.Router();
const deploymentController = require('../controllers/deploymentController');

// Trigger deployment
router.post('/deploy', deploymentController.deploy);

module.exports = router;

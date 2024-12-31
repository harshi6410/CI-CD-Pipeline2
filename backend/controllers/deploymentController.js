const deploymentService = require('../services/deploymentService');

exports.deploy = (req, res) => {
    deploymentService.deployApp()
        .then(result => {
            res.status(200).json({ message: 'Deployment started successfully.' });
        })
        .catch(error => {
            res.status(500).json({ message: 'Deployment failed.', error });
        });
};

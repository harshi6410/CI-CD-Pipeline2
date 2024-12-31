pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        APP_NAME = 'ci-cd-app'
        DOCKER_IMAGE = 'ci-cd-app-image'.toLowerCase()  // Ensure image name is lowercase
        REGISTRY = 'icr.io/ci-cd-app'  // Replace with your namespace
    }

    stages {
        // Checkout code from GitHub repository
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        // Install application dependencies
        stage('Install Dependencies') {
            steps {
                script {
                    bat 'npm install'  // Run npm install to install dependencies
                }
            }
        }

        // Run tests
        stage('Run Tests') {
            steps {
                script {
                    bat 'npm test'  // Run tests using npm
                }
            }
        }

        // Build the application
        stage('Build Application') {
            steps {
                script {
                    bat 'npm run build'  // Run build command (e.g., npm run build)
                }
            }
        }

        // Build Docker Image
        stage('Dockerize Application') {
            steps {
                script {
                    bat "docker build -t ${env.REGISTRY}/${env.DOCKER_IMAGE}:latest ."  // Build Docker image
                }
            }
        }

        // Push Docker image to IBM Cloud Container Registry
        stage('Push Docker Image') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'ibmcloud_apikey', variable: 'IBM_CLOUD_APIKEY')]) {
                        bat '''
                        ibmcloud login --apikey %IBM_CLOUD_APIKEY% -r us-south
                        ibmcloud cr login
                        docker push ${env.REGISTRY}/${env.DOCKER_IMAGE}:latest
                        '''
                    }
                }
            }
        }

        // Deploy to Kubernetes
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withCredentials([kubeconfigFile(credentialsId: 'kube-config', variable: 'KUBECONFIG')]) {
                        // Update the Kubernetes deployment with the new image
                        bat "kubectl set image deployment/your-deployment-name your-container-name=${env.REGISTRY}/${env.DOCKER_IMAGE}:latest"
                        bat "kubectl rollout status deployment/your-deployment-name"
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline execution failed.'
        }
    }
}

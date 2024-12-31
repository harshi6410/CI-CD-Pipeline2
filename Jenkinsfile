pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        APP_NAME = 'ci-cd-app'
        DOCKER_IMAGE = 'ci-cd-app-image'
        REGISTRY = 'your-docker-registry'  // Use your Docker registry URL
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
                    bat "docker build -t ${env.DOCKER_IMAGE} ."  // Build Docker image
                }
            }
        }

        // Push Docker image to Docker registry
        stage('Push Docker Image') {
            steps {
                script {
                    // Docker login to Docker Hub or another registry
                    withCredentials([usernamePassword(credentialsId: 'dockerhub_creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        bat "echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin"
                    }
                    // Push the Docker image to Docker registry
                    bat "docker push ${DOCKER_USERNAME}/${DOCKER_IMAGE}:latest"
                }
            }
        }

        // Deploy to Kubernetes
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    withCredentials([kubeconfigFile(credentialsId: 'kube-config', variable: 'KUBECONFIG')]) {
                        // Update the Kubernetes deployment with the new image
                        bat "kubectl set image deployment/your-deployment-name your-container-name=${DOCKER_IMAGE}:latest"
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

pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        APP_NAME = 'ci-cd-app'
        DOCKER_IMAGE = 'ci-cd-app-image'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Checkout the code from the Git repository
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Install dependencies using npm
                    bat 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Run tests using Mocha or Jest (ensure you have test scripts in package.json)
                    bat 'npm test'
                }
            }
        }

        stage('Build Application') {
            steps {
                script {
                    // Run any build process if needed (e.g., bundling assets)
                    bat 'npm run build'
                }
            }
        }

        stage('Dockerize Application') {
            steps {
                script {
                    // Build the Docker image
                    bat 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Push the Docker image to a registry (Docker Hub or AWS ECR)
                    // Example: Docker Hub push
                    bat 'docker tag $DOCKER_IMAGE harshi6410/$DOCKER_IMAGE'
                    bat 'docker push harshi6410/$DOCKER_IMAGE'
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
                    // Trigger the deployment to your cloud platform or server
                    // Example using the deployScript.sh script in pipeline/deploy folder
                    bat './pipeline/deploy/deployScript.sh'
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

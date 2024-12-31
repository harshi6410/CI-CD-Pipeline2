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
                    sh 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Run tests using Mocha or Jest (ensure you have test scripts in package.json)
                    sh 'npm test'
                }
            }
        }

        stage('Build Application') {
            steps {
                script {
                    // Run any build process if needed (e.g., bundling assets)
                    sh 'npm run build'
                }
            }
        }

        stage('Dockerize Application') {
            steps {
                script {
                    // Build the Docker image
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Push the Docker image to a registry (Docker Hub or AWS ECR)
                    // Example: Docker Hub push
                    sh 'docker tag $DOCKER_IMAGE harshi6410/$DOCKER_IMAGE'
                    sh 'docker push harshi6410/$DOCKER_IMAGE'
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
                    // Trigger the deployment to your cloud platform or server
                    // Example using the deployScript.sh script in pipeline/deploy folder
                    sh './pipeline/deploy/deployScript.sh'
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

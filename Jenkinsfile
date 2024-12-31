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
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    bat 'npm install'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    bat 'npm test'
                }
            }
        }

        stage('Build Application') {
            steps {
                script {
                    bat 'npm run build'
                }
            }
        }

        stage('Dockerize Application') {
            steps {
                script {
                    // Correcting the way the environment variable is referenced
                    bat "docker build -t ${env.DOCKER_IMAGE} ."
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Docker login to Docker Hub
                    withCredentials([usernamePassword(credentialsId: 'dockerhub_creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        // Ensure Docker login with credentials
                        bat "echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin"
                    }

                    // Tag the Docker image
                    bat "docker tag ${DOCKER_IMAGE} ${DOCKER_USERNAME}/${DOCKER_IMAGE}:latest"

                    // Push the Docker image to Docker Hub
                    bat "docker push ${DOCKER_USERNAME}/${DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
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

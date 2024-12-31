pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        APP_NAME = 'ci-cd-app'
        DOCKER_IMAGE = 'ci-cd-app-image'
        DOCKER_HUB_REPO = 'your-dockerhub-username/ci-cd-app-image' // Replace with your Docker Hub repo
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
                    // Assuming tests are written in JavaScript and use a testing framework like Mocha or Jest
                    // You may need to replace this command with the one suitable for your testing framework
                    bat 'npm test'  // This runs your test script, which should be defined in package.json
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
                    bat "docker build -t ${env.DOCKER_IMAGE} ."
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub_creds', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                        // Docker login to Docker Hub
                        bat "echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin"

                        // Tag the Docker image
                        bat "docker tag ${env.DOCKER_IMAGE} ${env.DOCKER_HUB_REPO}:latest"

                        // Push the Docker image to Docker Hub
                        bat "docker push ${env.DOCKER_HUB_REPO}:latest"
                    }
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
                    // Using the correct bash path for Windows to run the deploy script
                    bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "./pipeline/deploy/deployScript.sh"'
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

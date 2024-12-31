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
                    bat "docker build -t ${env.DOCKER_IMAGE} ."
                }
            }
        }

        // Removed Push Docker Image Stage

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

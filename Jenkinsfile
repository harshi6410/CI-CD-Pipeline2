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

        stage('Deploy to Production') {
    steps {
        script {
            // Use double quotes to escape the path with spaces
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

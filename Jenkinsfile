pipeline {
    agent any
    environment {
        REGISTRY_URL = "us.icr.io"         // IBM Cloud Registry URL
        NAMESPACE = "ci-cd-app"            // Replace with your IBM Cloud namespace
        IMAGE_NAME = "myapp"               // Replace with your Docker image name
        TAG = "latest"                     // Replace with your desired tag (e.g., version)
        DOCKER_CLI = "docker"              // Docker CLI
        IBM_CLOUD_CLI = "ibmcloud"        // IBM Cloud CLI
    }
    stages {
        stage('Checkout') {
            steps {
                script {
                    // Clean workspace to ensure no leftover state
                    deleteDir()
                    echo 'Checking out the code from GitHub repository...'
                    // Use the correct credentials ID to authenticate with GitHub
                    git credentialsId: 'github-token', url: 'https://github.com/harshi6410/CI-CD-Pipeline2.git', branch: 'main'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat '''
                    echo Building Docker image...
                    docker build -t %IMAGE_NAME%:%TAG% .
                '''
            }
        }

        stage('Tag Docker Image') {
            steps {
                bat '''
                    echo Tagging Docker image for IBM Cloud Container Registry...
                    docker tag %IMAGE_NAME%:%TAG% %REGISTRY_URL%/%NAMESPACE%/%IMAGE_NAME%:%TAG%
                '''
            }
        }

        stage('Push to IBM Cloud Container Registry') {
            steps {
                script {
                    // Ensure IBM Cloud CLI is authenticated
                    echo 'Logging into IBM Cloud...'
                    bat '''
                        ibmcloud login --apikey YOUR_IBM_API_KEY --no-region
                        ibmcloud cr login
                    '''
                    
                    // Push the Docker image to IBM Cloud Container Registry
                    echo 'Pushing Docker image to IBM Cloud Container Registry...'
                    bat '''
                        docker push %REGISTRY_URL%/%NAMESPACE%/%IMAGE_NAME%:%TAG%
                    '''
                }
            }
        }
    }
    post {
        always {
            // Clean up Docker images to free up space after pushing
            echo 'Cleaning up Docker images...'
            bat '''
                docker system prune -f
            '''
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline execution failed!'
        }
    }
}

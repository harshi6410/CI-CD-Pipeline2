pipeline {
    agent any
    environment {
        REGISTRY_URL = "us.icr.io"           // IBM Cloud Registry URL
        NAMESPACE = "my_namespace"           // Replace with your IBM Cloud namespace
        IMAGE_NAME = "myapp"                 // Replace with your Docker image name
        TAG = "latest"                       // Replace with your desired tag (e.g., version)
    }
    stages {
        stage('Checkout') {
            steps {
                // Checkout the latest code from the GitHub repository
                git 'https://github.com/your-repo/your-project.git'
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
                bat '''
                    echo Logging in to IBM Cloud Container Registry...
                    ibmcloud cr login
                    
                    echo Pushing Docker image to IBM Cloud Container Registry...
                    docker push %REGISTRY_URL%/%NAMESPACE%/%IMAGE_NAME%:%TAG%
                '''
            }
        }
    }
}

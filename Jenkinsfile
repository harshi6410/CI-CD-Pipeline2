pipeline {
    agent any
    environment {
        REGISTRY_URL = "us.icr.io"
        NAMESPACE = "my_namespace"      // Replace with your IBM Cloud namespace
        IMAGE_NAME = "myapp"            // Replace with your Docker image name
        TAG = "latest"                  // Replace with your desired tag (e.g., version)
    }
    stages {
        stage('Checkout') {
            steps {
                // Checkout the latest code from GitHub repository
                git 'https://github.com/your-repo/your-project.git'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    sh 'docker build -t ${IMAGE_NAME}:${TAG} .'
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                script {
                    // Tag the Docker image for IBM Cloud Container Registry
                    sh 'docker tag ${IMAGE_NAME}:${TAG} ${REGISTRY_URL}/${NAMESPACE}/${IMAGE_NAME}:${TAG}'
                }
            }
        }

        stage('Push to IBM Cloud Container Registry') {
            steps {
                script {
                    // Log in to IBM Cloud Container Registry
                    sh 'ibmcloud cr login'
                    
                    // Push the Docker image to IBM Cloud Container Registry
                    sh 'docker push ${REGISTRY_URL}/${NAMESPACE}/${IMAGE_NAME}:${TAG}'
                }
            }
        }
    }
}

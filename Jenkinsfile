pipeline {
    agent any
    environment {
        REGISTRY_URL = "us.icr.io"         // IBM Cloud Registry URL
        NAMESPACE = "ci-cd-app"            // Replace with your IBM Cloud namespace
        IMAGE_NAME = "myapp"               // Replace with your Docker image name
        TAG = "latest"                     // Replace with your desired tag (e.g., version)
        DOCKER_CLI = "docker"              // Docker CLI
        IBM_CLOUD_CLI = "ibmcloud"        // IBM Cloud CLI
        MINIKUBE_HOME = "/c/Minikube"      // Path to Minikube installation (example path for Windows)
    }
    stages {
        stage('Install IBM Cloud Container Registry Plugin') {
            steps {
                script {
                    echo 'Checking if IBM Cloud Container Registry plugin is installed...'
                    def pluginList = bat(script: "ibmcloud plugin list", returnStdout: true).trim()
                    if (!pluginList.contains('container-registry')) {
                        echo 'IBM Cloud Container Registry plugin not found. Installing plugin...'
                        bat 'ibmcloud plugin install container-registry -f'
                    } else {
                        echo 'IBM Cloud Container Registry plugin is already installed.'
                    }
                }
            }
        }

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
                    // Ensure IBM Cloud CLI is authenticated using credentials stored in Jenkins
                    withCredentials([string(credentialsId: 'ibm-cloud-api-key', variable: 'IBM_API_KEY')]) {
                        echo 'Logging into IBM Cloud...'
                        
                        // Log in to IBM Cloud using the API Key
                        bat """
                            ibmcloud login --apikey %IBM_API_KEY% --no-region
                            ibmcloud cr login
                        """
                    }

                    // Push the Docker image to IBM Cloud Container Registry
                    echo 'Pushing Docker image to IBM Cloud Container Registry...'
                    bat '''
                        docker push %REGISTRY_URL%/%NAMESPACE%/%IMAGE_NAME%:%TAG%
                    '''
                }
            }
        }

        stage('Setup Minikube') {
            steps {
                script {
                    echo 'Starting Minikube...'
                    bat """
                        minikube start --driver=virtualbox
                    """
                    // Set kubectl to interact with Minikube
                    bat """
                        kubectl config use-context minikube
                    """
                }
            }
        }

        stage('Deploy to Minikube') {
            steps {
                script {
                    // Apply the Kubernetes Deployment using kubectl
                    echo 'Deploying to Minikube...'

                    // Replace `deployment.yaml` with the correct path to your Kubernetes deployment manifest
                    // Ensure you have a valid `deployment.yaml` file in your repository
                    bat """
                        kubectl apply -f deployment.yaml
                    """

                    echo 'Deployment to Minikube complete!'
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

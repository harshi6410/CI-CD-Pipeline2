pipeline {
    agent any

    environment {
        // General environment variables
        NODE_ENV = 'production'
        APP_NAME = 'ci-cd-app'
        DOCKER_IMAGE = 'ci-cd-app-image'.toLowerCase()  // Ensure image name is lowercase
        REGISTRY = 'icr.io/ci-cd-app'  // Replace with your namespace
        REGISTRY_URL = "us.icr.io"          // IBM Cloud Registry URL
        NAMESPACE = "ci-cd-app"             // Replace with your IBM Cloud namespace
        IMAGE_NAME = "ci-cd-app-image"      // Docker image name
        TAG = "latest"                      // Desired Docker image tag
        DOCKER_CLI = "docker"               // Docker CLI
        IBM_CLOUD_CLI = "ibmcloud"         // IBM Cloud CLI
        KUBECONFIG = 'C:\\Users\\chira\\.kube\\config'  // Path to the kubeconfig file for Minikube
    }

    stages {
        // Checkout code from GitHub repository
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        // Install dependencies (e.g., npm install)
        stage('Install Dependencies') {
            steps {
                script {
                    bat 'npm install'  // Run npm install to install dependencies
                }
            }
        }

        // Run tests (e.g., npm test)
        stage('Run Tests') {
            steps {
                script {
                    bat 'npm test'  // Run tests using npm
                }
            }
        }

        // Build the application (e.g., npm run build)
        stage('Build Application') {
            steps {
                script {
                    bat 'npm run build'  // Run build command (e.g., npm run build)
                }
            }
        }

        // Build Docker Image
        stage('Build Docker Image') {
            steps {
                bat '''
                    echo Building Docker image...
                    docker build -t %REGISTRY_URL%/%NAMESPACE%/%IMAGE_NAME%:%TAG% .
                '''
            }
        }

        // Install IBM Cloud Container Registry plugin if not already installed
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

        // Push Docker image to IBM Cloud Container Registry
        stage('Push Docker Image to IBM Cloud Registry') {
            steps {
                script {
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

        // Deploy to Minikube
        stage('Deploy to Minikube') {
            steps {
                script {
                    echo 'Deploying to Minikube...'

                    // Set the Kubernetes context for Minikube
                    bat '''
                        kubectl config use-context minikube
                    '''

                    // Apply the Kubernetes Deployment using kubectl
                    bat """
                        kubectl apply -f k8s/deployment.yaml
                    """
                    echo 'Deployment to Minikube complete!'

                    // Optionally, check the status of pods in Minikube
                    echo 'Checking pod status in Minikube...'
                    bat '''
                        kubectl get pods
                    '''
                }
            }
        }

        // Deploy to IBM Cloud Kubernetes (if deployment.yaml exists)
        stage('Deploy to IBM Cloud') {
            steps {
                script {
                    // Check if the file exists in the workspace before attempting deployment
                    if (fileExists('k8s/deployment.yaml')) {
                        echo 'Deploying to IBM Cloud...'

                        // Apply the Kubernetes Deployment using kubectl
                        bat '''
                            kubectl apply -f k8s/deployment.yaml
                        '''
                        echo 'Deployment to IBM Cloud complete!'
                    } else {
                        echo 'Deployment file not found. Skipping deployment to IBM Cloud.'
                    }
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

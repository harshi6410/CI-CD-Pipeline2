pipeline {
    agent any

    environment {
        REGISTRY_URL = "us.icr.io"          // IBM Cloud Registry URL
        NAMESPACE = "ci-cd-app"             // Replace with your IBM Cloud namespace
        IMAGE_NAME = "myapp"                // Replace with your Docker image name
        TAG = "latest"                      // Replace with your desired tag (e.g., version)
        DOCKER_CLI = "docker"               // Docker CLI
        IBM_CLOUD_CLI = "ibmcloud"         // IBM Cloud CLI
        KUBECONFIG = 'C:\\Users\\chira\\.kube\\config'  // Path to the kubeconfig file for Minikube
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
                    docker build -t %REGISTRY_URL%/%NAMESPACE%/%IMAGE_NAME%:%TAG% .
                '''
            }
        }

        stage('Push Docker Image to IBM Cloud Registry') {
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

        // IBM Cloud Deployment (Now using k8s/deployment.yaml)
        stage('Deploy to IBM Cloud') {
            steps {
                script {
                    // Check if the file exists in the workspace before attempting deployment
                    if (fileExists('k8s/deployment.yaml')) {
                        echo 'Deploying to IBM Cloud...'

                        // Assuming you have the same deployment.yaml for IBM Cloud as well
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

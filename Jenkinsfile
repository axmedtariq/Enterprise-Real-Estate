pipeline {
    agent any

    environment {
        DOCKER_IMAGE_AUTH = "sovereign-auth-service"
        DOCKER_IMAGE_GATEWAY = "sovereign-gateway"
        DOCKER_IMAGE_CLIENT = "sovereign-client"
    }

    stages {
        stage('🧹 PREPARATION') {
            steps {
                echo '🛡️ Initializing Enterprise Security Pipeline...'
                sh 'npm install -g snyk'
            }
        }

        stage('🛡️ SECURE SCAN (SCA)') {
            steps {
                parallel(
                    "Auth Service": { dir('services/auth-service') { sh 'npm install && snyk test' } },
                    "Gateway": { dir('gateway') { sh 'npm install && snyk test' } },
                    "Client": { dir('client') { sh 'npm install && snyk test' } }
                )
            }
        }

        stage('🧪 QUALITY GUARD (Unit Tests)') {
            steps {
                parallel(
                    "Auth Service": { dir('services/auth-service') { sh 'npm test' } },
                    "Client": { dir('client') { sh 'npm test' } }
                )
            }
        }

        stage('🏗️ SECURE BUILD (Artifact Creation)') {
            steps {
                parallel(
                    "Auth Service": { dir('services/auth-service') { sh 'npm run build' } },
                    "Client": { dir('client') { sh 'npm run build' } }
                )
            }
        }

        stage('🗳️ DOCKERIZATION') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE_AUTH ./services/auth-service'
                sh 'docker build -t $DOCKER_IMAGE_GATEWAY ./gateway'
                sh 'docker build -t $DOCKER_IMAGE_CLIENT ./client'
            }
        }

        stage('🚀 STAGING DEPLOY') {
            steps {
                sh 'kubectl apply -f k8s/'
                sh 'kubectl rollout status deployment/sovereign-backend -n sovereign-production'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo '✅ Deployment Successful. Enterprise Online.'
        }
        failure {
            echo '❌ Pipeline FAILED. Security Breach or Regression Detected.'
        }
    }
}

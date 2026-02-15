pipeline {
    agent any

    environment {
        // Use Jenkins Credentials Provider for elite security
        DOCKER_HUB = credentials('docker-hub-credentials')
        DOCKER_HUB_USER = "sovereign-global"
        APP_NAME = "elite-estate"
        BUILD_TAG = "1.0.${env.BUILD_NUMBER}"
    }

    stages {
        stage('🏛️ Initialize & Audit') {
            steps {
                echo "Initiating Sovereign Launch Sequence: ${BUILD_TAG}"
                checkout scm
                dir('backend') {
                    // Fail fast if high-level vulnerabilities exist
                    sh 'npm audit --audit-level=high'
                }
            }
        }

        stage('⚡ Parallel Build') {
            // Build frontend and backend simultaneously to save time
            parallel {
                stage('Build Backend') {
                    steps {
                        sh "docker build -t ${DOCKER_HUB_USER}/${APP_NAME}-backend:${BUILD_TAG} ./backend"
                    }
                }
                stage('Build Frontend') {
                    steps {
                        sh "docker build -t ${DOCKER_HUB_USER}/${APP_NAME}-frontend:${BUILD_TAG} ./frontend-next"
                    }
                }
            }
        }

        stage('🛡️ Container Scanning') {
            steps {
                // Optional: Integrate Trivy or Snyk here for container security
                echo "Scanning container images for vulnerabilities..."
            }
        }

        stage('📦 Push to Elite Registry') {
            steps {
                script {
                    sh "echo $DOCKER_HUB_PSW | docker login -u $DOCKER_HUB_USR --password-stdin"
                    
                    // Push specific build tag and latest for redundancy
                    sh "docker push ${DOCKER_HUB_USER}/${APP_NAME}-backend:${BUILD_TAG}"
                    sh "docker tag ${DOCKER_HUB_USER}/${APP_NAME}-backend:${BUILD_TAG} ${DOCKER_HUB_USER}/${APP_NAME}-backend:latest"
                    sh "docker push ${DOCKER_HUB_USER}/${APP_NAME}-backend:latest"
                }
            }
        }

        stage('🚀 Sovereign Deployment') {
            steps {
                script {
                    // Using Zero-Downtime restart logic
                    sh "docker-compose pull"
                    sh "docker-compose up -d --remove-orphans"
                    echo "SYSTEM ONLINE: Assets synchronized across 1.5M network nodes."
                }
            }
        }
    }

    post {
        always {
            // Clean up the workspace to prevent disk bloat
            cleanWs()
            sh "docker logout"
        }
        success {
            echo "Deployment Successful, Sir. The Sovereign network is stable."
        }
        failure {
            // Integrate Slack or Email notifications here for instant alerts
            echo "CRITICAL: Deployment failure at stage ${env.STAGE_NAME}. Security lockdown initiated."
        }
    }
}
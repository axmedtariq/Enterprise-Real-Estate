def sendSlackNotification(String buildStatus, String customMessage = "") {
    def colorCode = buildStatus == 'SUCCESS' ? '#36a64f' : (buildStatus == 'FAILURE' ? '#FF0000' : '#FFCC00')
    def emoji = buildStatus == 'SUCCESS' ? '✅' : (buildStatus == 'FAILURE' ? '❌' : '⚠️')
    
    def commitMsg = ""
    def commitAuthor = ""
    def commitHash = ""
    
    try {
        commitMsg = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
        commitAuthor = sh(script: 'git log -1 --pretty=%an', returnStdout: true).trim()
        commitHash = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
    } catch (Exception e) {
        commitMsg = "Unknown (Git log failed)"
        commitAuthor = "Unknown"
        commitHash = "Unknown"
    }
    
    def argocdUrl = "https://argocd.sovereign-control.local/applications/elite-estate"

    def blocksJson = """
    [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "${emoji} Pipeline Status: ${buildStatus}",
                "emoji": true
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": "*Project:*\\n\${env.JOB_NAME}"
                },
                {
                    "type": "mrkdwn",
                    "text": "*Build Number:*\\n<\${env.BUILD_URL}|\${env.BUILD_NUMBER}>"
                }
            ]
        }
    ]
    """
    
    slackSend(
        color: colorCode,
        channel: '#cicd-alerts',
        blocks: blocksJson
    )
}

pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = "sovereign-global"
        APP_NAME = "elite-estate"
        BUILD_TAG = "1.0.${env.BUILD_NUMBER}"
    }

    stages {
        // 🏛️ STEP 1: RUN TESTS
        stage('🏛️ Step 1: Run Sovereign Tests') {
            steps {
                echo "Executing Sovereign Protection Tests..."
                checkout scm
                dir('backend') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }

        // 🛡️ STEP 2: RUN SECURITY SCAN
        stage('🛡️ Step 2: Run Security Scan') {
            steps {
                script {
                    echo "Initiating Multi-Vector Security Scan..."
                    // 1. Dependency Analysis (SCA)
                    dir('backend') {
                        sh 'npm audit --audit-level=high'
                    }
                    
                    // 2. Terraform Security Scan
                    sh "docker run --rm -v \$(pwd):/src aquasec/tfsec /src/terraform --format json --out tfsec-results.json" || echo "TFSec scan reported issues."
                }
            }
        }

        // ⚡ STEP 3: BUILD DOCKER IMAGE
        stage('⚡ Step 3: Build Docker Image') {
            steps {
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
        }

        // 🛡️ STEP 3.5: CONTAINER SCANNING (Deep Protection)
        stage('🛡️ STEP 3.5: Deep Container Scanning') {
            steps {
                script {
                    echo "Scanning images for vulnerabilities..."
                    sh "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image --severity HIGH,CRITICAL --exit-code 1 ${DOCKER_HUB_USER}/${APP_NAME}-backend:${BUILD_TAG}"
                }
            }
        }

        // 📦 STEP 4: PUSH TO REGISTRY
        stage('📦 Step 4: Push to Elite Registry') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                        
                        sh "docker push ${DOCKER_HUB_USER}/${APP_NAME}-backend:${BUILD_TAG}"
                        sh "docker tag ${DOCKER_HUB_USER}/${APP_NAME}-backend:${BUILD_TAG} ${DOCKER_HUB_USER}/${APP_NAME}-backend:latest"
                        sh "docker push ${DOCKER_HUB_USER}/${APP_NAME}-backend:latest"

                        sh "docker push ${DOCKER_HUB_USER}/${APP_NAME}-frontend:${BUILD_TAG}"
                        sh "docker tag ${DOCKER_HUB_USER}/${APP_NAME}-frontend:${BUILD_TAG} ${DOCKER_HUB_USER}/${APP_NAME}-frontend:latest"
                        sh "docker push ${DOCKER_HUB_USER}/${APP_NAME}-frontend:latest"
                    }
                }
            }
        }

        // 🚀 STEP 5: DEPLOY AUTOMATICALLY
        stage('🚀 Step 5: Deploy Automatically (K8s)') {
            steps {
                script {
                    echo "Rolling infrastructure into production..."
                    
                    // Apply Kubernetes Manifests in specific order
                    sh "kubectl apply -f k8s/storage.yaml"
                    sh "kubectl apply -f k8s/vault.yaml"
                    sh "kubectl apply -f k8s/redis.yaml" 
                    sh "kubectl apply -f k8s/sqlserver.yaml"
                    sh "kubectl apply -f k8s/db-backups.yaml"
                    sh "kubectl apply -f k8s/backend.yaml"
                    sh "kubectl apply -f k8s/frontend.yaml"
                    sh "kubectl apply -f k8s/nginx.yaml"
                    
                    // Ensure zero-downtime pick-up
                    sh "kubectl rollout status deployment/backend"
                    sh "kubectl rollout status deployment/frontend"
                    
                    echo "PLATFORM LIVE & STABLE."
                }
            }
        }
    }

    post {
        always {
            cleanWs()
            sh "docker logout"
        }
        success {
            sendSlackNotification("SUCCESS", "Sovereign platform stabilized on production nodes.")
        }
        failure {
            sendSlackNotification("FAILURE", "Pipeline breached at stage: \${env.STAGE_NAME}")
        }
    }
}
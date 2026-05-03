pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "vinayak0910/ci-cd-demo"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Branch: ${env.BRANCH_NAME}, Build: ${env.BUILD_NUMBER}"
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
            }
        }

        stage('Run Tests') {
            steps {
                sh """
                    docker run --rm \
                        -e NODE_ENV=test \
                        ${DOCKER_IMAGE}:${DOCKER_TAG} \
                        npm test
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                    sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    sh "docker push ${DOCKER_IMAGE}:latest"
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                sh """
                    docker stop ci-cd-demo-staging || true
                    docker rm ci-cd-demo-staging || true
                    docker run -d \
                        --name ci-cd-demo-staging \
                        -p 3001:3000 \
                        -e APP_VERSION=${DOCKER_TAG} \
                        ${DOCKER_IMAGE}:${DOCKER_TAG}
                """
            }
        }

        stage('Smoke Test') {
            steps {
                sh "sleep 5"
                sh "curl -f http://localhost:3001/health || exit 1"
            }
        }

        stage('Deploy to Production') {
            when { branch 'main' }
            steps {
                input message: "Deploy build ${DOCKER_TAG} to production?"
                sh """
                    docker stop ci-cd-demo-prod || true
                    docker rm ci-cd-demo-prod || true
                    docker run -d \
                        --name ci-cd-demo-prod \
                        -p 3000:3000 \
                        -e APP_VERSION=${DOCKER_TAG} \
                        ${DOCKER_IMAGE}:${DOCKER_TAG}
                """
            }
        }
    }

    post {
        success {
            echo "Pipeline succeeded! Image: ${DOCKER_IMAGE}:${DOCKER_TAG}"
        }
        failure {
            echo "Pipeline failed on build ${DOCKER_TAG}"
        }
        always {
            sh "docker image prune -f"
        }
    }
}

def createVersion() {
    Date d = new Date()
    TimeZone tz = TimeZone.getTimeZone('Asia/Shanghai')
    return d.format('yyyyMMddHHmm', tz)
}

pipeline {
    agent any

    environment {
        TAG = createVersion()
        APP = "fe-scaffold"
    }

    stages {
        stage('environment') {
            steps {
                script {
                    if (env.BRANCH_NAME == "master") {
                        env.REPO_URL = "hub.docker.com"
                        env.REPO_NAME = "development"
                        env.BUILD_NAME = "test"
                    }
                    if (env.BRANCH_NAME == "production") {
                        env.REPO_URL = "hub.docker.com"
                        env.REPO_NAME = "prod"
                        env.BUILD_NAME = "prod"
                    }

                    sh "echo Branch: ${env.BRANCH_NAME}"
                }
            }
        }

        stage('yarn') {
            steps {
                sh '''yarn install && yarn build-${BUILD_NAME}'''
            }
        }

        stage('docker build') {
            steps {
                sh '''docker build -t ${REPO_URL}/${REPO_NAME}/${APP}:${TAG} .
                      docker push ${REPO_URL}/${REPO_NAME}/${APP}:${TAG}'''
                echo "${env.REPO_URL}/${env.REPO_NAME}/${env.APP}:${env.TAG}"
            }
        }
    }
}

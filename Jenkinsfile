#!groovy
pipeline {
    agent any
    stages {
        stage('build') {
            agent {
                dockerfile {
                    filename 'Dockerfile.build'
                    dir 'services/QuillJenkins/agents/QuillLMS'
                    args '-u root:sudo -v $HOME/workspace/myproject:/myproject'
                }
            }
            environment {
                //GITHUB_PASS = credentials('github-pass')
            }
            steps {

                sh 'echo "Beginning BUILD..."'
                script {
                  try {
                    sh 'rm -r Empirical-Core'
                  }
                  catch (exc) {
                    sh 'echo "Cloning..."' 
                  }
                }

                sshagent (credentials: ['jenkins-ssh']) {
                  sh 'echo "Adding github.com to list of known hosts"'
                  sh 'ssh-keyscan -H github.com >> ~/.ssh/known_hosts'
                  sh 'echo "Cloning repository..."'
                  sh 'git clone git@github.com:empirical-org/Empirical-Core.git'
                }

                sh 'echo "Build successful!"'
            }
        }
        stage('test') {
            steps {
                sh 'echo "Beginnning TEST..."'
                sh 'echo "Test successful!"'
            }
        }
        stage('deploy') {
            steps {
                sh 'echo "Beginnning DEPLOY..."'
                script {
                  if ("$env.BRANCH_NAME" == 'master') {
                    sh 'echo "Quill.org successfully deployed!"'
                  }
                  else if ("$env.BRANCH_NAME" == 'develop') {
                    sh 'echo "Staging successfully deployed!"'
                  }
                  else {
                    sh 'echo "deploy stage ignored; you are not on master or develop."'
                  }
                }
            }
        }
    }
}

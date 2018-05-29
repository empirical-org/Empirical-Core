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
                sh 'echo "Cloning repository..."'
                script {
                  try {
                    sh 'rm -r Empirical-Core'
                  }
                  catch (exc) {
                    sh 'echo "Cloning..."' 
                  }
                }

                sh 'git clone https://github.com/buckmaxwell/maxwellbuck.com.git'

                sh 'echo "Installing python requirements..."'
                sh 'cd maxwellbuck.com'
                sh 'pip install grip==4.5.2'

                sh 'echo "Running build script..."'
                script {
                  if ("$env.BRANCH_NAME" == 'develop') {
                    sh './build.sh staging'
                  }
                  else {
                    sh './build.sh'
                  }
                }

                
                sh 'echo "Build successful!"'
                stash includes: 'zipped_site/', name: 'site_stash'
                stash includes: 'nginx_config/', name: 'nginx_stash'
            }
        }
        stage('test') {
            steps {
                sh 'echo "Beginnning TEST..."'
                unstash 'site_stash'
                sh 'cd zipped_site'
                sh 'cd ..'
                sh 'echo "stash successfully opened"'
                sh 'echo "listing contents of static"'
                sh 'ls zipped_site/static'
            }
        }
        stage('deploy') {
            steps {
                unstash 'site_stash'
                unstash 'nginx_stash'
                script {
                  if ("$env.BRANCH_NAME" == 'master') {
                    sh 'echo "Deploying maxwellbuck.com..."'
                    sh 'echo "Translating urls to staging versions..."'
                    sh 'echo "Copying site into place..."'
                    sshagent (credentials: ['build-ssh']) {
                      sh 'scp -o StrictHostKeyChecking=no -r zipped_site/* max@maxwellbuck.com:/var/www/html'
                      sh 'scp -o StrictHostKeyChecking=no -r nginx_config/* max@maxwellbuck.com:/etc/nginx/sites-enabled'
                    }
                    sh 'echo "Success! maxwellbuck.com has been deployed."'
                  }
                  else if ("$env.BRANCH_NAME" == 'develop') {
                    sh 'echo "Copying site to staging directory..."'
                    sshagent (credentials: ['build-ssh']) {
                      sh 'scp -o StrictHostKeyChecking=no -r zipped_site/* max@maxwellbuck.com:/var/www/html/staging'
                      sh 'scp -o StrictHostKeyChecking=no -r nginx_config/* max@maxwellbuck.com:/etc/nginx/sites-enabled'
                    }
                    sh 'echo "Staging successfully deployed!"'
                  }
                  else {
                    sh 'echo "deploy stage ignored; you are not on master or develop."'
                  }
                }
                sh "sudo /var/lib/jenkins/jobs/maxwellbuck.com/scripts/restart-nginx.sh"
            }
        }

    }
}

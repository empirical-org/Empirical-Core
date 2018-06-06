#!groovy
pipeline {
  agent any
  stages {
    stage('start-postgres-docker') {
      steps {
        echo "Starting postgres docker container..."
        script {
          sh 'docker network create jnk-net'
          /*sh 'docker run --name lms-testdb --network jnk-net -d -p 127.0.0.1:5432:5432 postgres:10.1'*/
          sh 'docker run --name lms-testdb --network jnk-net -d postgres:10.1'
        }
      }
    }
    stage('test') {
      agent {
        dockerfile {
          filename 'Dockerfile.test'
          dir 'services/QuillJenkins/agents/QuillLMS'
          args '-u root:sudo -v $HOME/workspace/myproject:/myproject --name lms-webapp --network jnk-net'
        }
      }
      environment {
          REDISCLOUD_URL='redis://localhost:6379/0'
          REDISCLOUD_NAMESPACE='test'
          RACK_ENV='test' /* for rake tasks, default is development */
          PROGRESS_REPORT_FOG_DIRECTORY='empirical-progress-report-dev'
          FOG_DIRECTORY='empirical-core-staging'
      }
      steps {
        echo "Beginnning TEST..."


        dir('services/QuillLMS') {
          echo 'Ensuring bundler is the right version...'
          sh 'gem install bundler'
          echo 'Installing Bundle...'
          sh 'bundle install'

          echo "Rspec:"
          echo "Setting up rspec..."
          sh 'cp config/database.yml.travis config/database.yml'
          sh 'bundle exec rake parallel:create'
          sh 'bundle exec rake parallel:load_structure'
          echo "Running rspec"
          sh 'bundle exec rake parallel:spec'
          /*sh 'bash <(curl -s https://codecov.io/bash) -cF rspec -f coverage/coverage.json'*/
          /*sh 'curl https://codecov.io/bash | bash -cF rspec -f * coverage/coverage.json'*/
          sh 'curl -s https://codecov.io/bash | bash -s - -cF rspec -f coverage/coverage.json'

          echo "Brakeman:"
          sh 'bundle exec brakeman -z'

          nvm(nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh',
             nvmIoJsOrgMirror: 'https://iojs.org/dist',
             nvmNodeJsOrgMirror: 'https://nodejs.org/dist',
             version: '7.5.0') {
                /* https://plugins.jenkins.io/nvm-wrapper */
                echo "Installing npm..."
                sh "npm install"
                echo "Building test distribution"
                sh 'npm run build:test'
                echo 'Running jest...'
                sh 'npm run jest:coverage'
                /*sh 'bash <(curl -s https://codecov.io/bash) -cF jest'*/
                sh 'curl -s https://codecov.io/bash | bash -s - -cF jest'

              }
          }

          /*nvm('v0.33.11') {
            echo 'Setting up jest...' 
            sh 'nvm install'
            sh 'npm install'
            sh 'npm run build:test'
            echo 'Running jest...'
            sh 'npm run jest:coverage'
            sh 'curl https://codecov.io/bash | bash -cF jest'
          }*/

          echo "Test successful!"
        }
      }
    }
    stage('deploy') {
      steps {
        echo "Beginnning DEPLOY..."
        script {
          if ("$env.BRANCH_NAME" == 'master') {
            echo "Quill.org successfully deployed!"
          }
          else if ("$env.BRANCH_NAME" == 'develop') {
            echo "Staging successfully deployed!"
          }
          else {
            echo "deploy stage ignored; you are not on master or develop."
          }
        }
      }
    }
  }
  post {
    always {
      echo "Stopping postgres docker container..."
      sh 'docker stop lms-testdb'
      sh 'docker rm lms-testdb'
      sh 'docker network rm jnk-net'
    }
  }
}

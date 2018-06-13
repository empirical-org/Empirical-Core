pipeline {
  agent any
  stages {
    stage('start-postgres-docker') {
      steps {
        echo 'Starting postgres docker container...'
        script {
          sh 'docker network create jnk-net'
          sh 'docker run --name lms-testdb --network jnk-net -d postgres:10.1'
        }

      }
    }
    stage('test') {
      parallel {
        // stage('test-QuillLMS-ruby') {
        //   agent {
        //     dockerfile {
        //       filename 'services/QuillJenkins/agents/QuillLMS/Dockerfile.test-ruby'
        //       dir '.'
        //       args '-u root:sudo -v $HOME/workspace/myproject:/myproject --name lms-webapp --network jnk-net'
        //     }
        //   }
        //   environment {
        //     REDISCLOUD_URL = 'redis://localhost:6379/0'
        //     REDISCLOUD_NAMESPACE = 'test'
        //     RACK_ENV = 'test'
        //     PROGRESS_REPORT_FOG_DIRECTORY = 'empirical-progress-report-dev'
        //     FOG_DIRECTORY = 'empirical-core-staging'
        //     CONTINUOUS_INTEGRATION = true
        //   }
        //   steps {
        //     echo 'Beginnning TEST...'
        //     dir(path: 'services/QuillLMS') {
        //       echo 'Rspec:'
        //       echo 'Setting up rspec...'
        //       sh 'cp config/database.yml.jenkins config/database.yml'
        //       echo 'Running rspec'
        //       sh 'bundle exec rake parallel:create'
        //       sh 'bundle exec rake parallel:load_structure'
        //       sh 'bundle exec rake parallel:spec'
        //       withCredentials(bindings: [string(credentialsId: 'codecov-token', variable: 'CODECOV_TOKEN')]) {
        //         sh "curl -s https://codecov.io/bash | bash -s - -cF rspec -f coverage/coverage.json -t $CODECOV_TOKEN"
        //       }
        //       echo 'Brakeman:'
        //       sh 'bundle exec brakeman -z'
        //       echo 'Test successful!'
        //     }
        //   }
        // }
          // stage('test-QuillLMS-node') {
        //   agent {
        //     dockerfile {
        //       filename 'Dockerfile.test-node'
        //       dir 'services/QuillJenkins/agents/QuillLMS'
        //       args '-u root:sudo -v $HOME/workspace/myproject:/myproject --name lms-webapp-frontend --network jnk-net'
        //     }

        //   }
        //   steps {
        //     echo 'Beginnning front-end tests...'
        //     withCredentials(bindings: [string(credentialsId: 'codecov-token', variable: 'CODECOV_TOKEN')]) {
        //       dir(path: 'services/QuillLMS') {
        //         echo 'Installing necessary packages...'
        //         sh 'npm install'
        //         sh 'ls'
        //         echo 'Building test distribution'
        //         sh 'npm run build:test'
        //         echo 'Running jest...'
        //         sh 'npm run jest:coverage'
        //         sh "curl -s https://codecov.io/bash | bash -s - -cF jest -t $CODECOV_TOKEN"
        //       }
        //       dir(path: 'services/QuillJenkins/scripts') {
        //         /* Check that code coverage has not decreased */
        //         sh "python -c'import codecov; codecov.fail_on_decrease(\"develop\", $env.BRANCH_NAME )' || exit"
        //       }
        //     }
        //   }
        // }
        stage('test-QuillComprehension-ruby') {
          agent {
            dockerfile {
              filename 'services/QuillJenkins/agents/QuillComprehension/Dockerfile.test-ruby'
              dir '.'
              args '-u root:sudo -v $HOME/workspace/myproject:/myproject --name QuillComprehension-webapp --network jnk-net -e NODE_VERSION="$(cat ./services/QuillComprehension/.nvmrc)"'
            }
          }
          environment {
            RACK_ENV = 'test'
          }
          steps {
            echo 'Beginnning TEST...'
            dir(path: 'services/QuillComprehension') {
              sh 'bundle install'
              // sh 'curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash && source ~/.bashrc && nvm install && nvm use'
              sh 'yarn install'
              echo 'DB:'
              sh 'cp config/database.yml.jenkins config/database.yml'
              sh 'bin/rails db:create'
              sh 'bin/rails db:schema:load'
              echo 'Rspec:'
              echo 'Setting up rspec...'
              echo 'Running rspec'
              sh 'bundle exec rspec'
              echo 'Running Jest'
              sh 'yarn test'
              echo 'Test successful!'
            }
          }
        }
      }
    }
    stage('deploy') {
      steps {
        echo 'Beginnning DEPLOY...'
        script {
          if ("$env.CHANGE_ID" && "$env.CHANGE_BRANCH" == 'develop') {
            echo "Automatically merging pull request $env.CHANGE_ID into master..."
          }
          else if ("$env.CHANGE_ID") {
            echo "Automatically merging pull request $env.CHANGE_ID into develop..."
          }
          else if ("$env.BRANCH_NAME" == 'develop') {
            echo "Automatically deploying develop to staging..."
          }
          else if ("$env.BRANCH_NAME" == 'master') {
            echo "Automatically deploying master to production..."
          }
          else {
            echo "Your branch is not master, develop, an open PR, or a branch with an open PR.  Nothing to do."
          }
        }
      }
    }
  }
  post {
    always {
      echo 'Stopping postgres docker container...'
      sh 'docker stop lms-testdb'
      sh 'docker rm lms-testdb'
      sh 'docker network rm jnk-net'
    }
  }
}


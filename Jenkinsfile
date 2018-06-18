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
        stage('test-QuillLMS-ruby') {
          agent {
            dockerfile {
              filename 'services/QuillJenkins/agents/QuillLMS/Dockerfile.test-ruby'
              dir '.'
              args '-u root:sudo -v $HOME/workspace/myproject:/myproject --name lms-webapp --network jnk-net'
            }
          }
          environment {
            REDISCLOUD_URL = 'redis://localhost:6379/0'
            REDISCLOUD_NAMESPACE = 'test'
            RACK_ENV = 'test'
            PROGRESS_REPORT_FOG_DIRECTORY = 'empirical-progress-report-dev'
            FOG_DIRECTORY = 'empirical-core-staging'
            CONTINUOUS_INTEGRATION = true
          }
          steps {
            echo 'Beginnning TEST...'
            dir(path: 'services/QuillLMS') {
              echo 'Rspec:'
              echo 'Setting up rspec...'
              sh 'cp config/database.yml.jenkins config/database.yml'
              echo 'Running rspec'
              sh 'bundle exec rake parallel:create'
              sh 'bundle exec rake parallel:load_structure'
              sh 'bundle exec rake parallel:spec'
              withCredentials(bindings: [string(credentialsId: 'codecov-token', variable: 'CODECOV_TOKEN')]) {
                sh "curl -s https://codecov.io/bash | bash -s - -cF rspec -f coverage/coverage.json -t $CODECOV_TOKEN"
              }
              echo 'Brakeman:'
              sh 'bundle exec brakeman -z'
              echo 'Test successful!'

              echo 'Beginnning front-end tests...'
              /*
              echo 'Installing necessary packages...'
              sh 'npm install'
              sh 'ls'
              echo 'Building test distribution'
              sh 'npm run build:test'
              echo 'Running jest...'
              sh 'npm run jest:coverage'
              withCredentials(bindings: [string(credentialsId: 'codecov-token', variable: 'CODECOV_TOKEN')]) {
                sh "curl -s https://codecov.io/bash | bash -s - -cF jest -t $CODECOV_TOKEN"
              }

              dir(path: 'services/QuillJenkins/scripts') {
                // Check that code coverage has not decreased
                sh "python -c'import codecov; codecov.fail_on_decrease(\"develop\", $env.BRANCH_NAME )' || exit"
              }
              */
              echo 'Front end tests disabled for now.  moving on!'
            }
          }
        }
        stage('test-QuillComprehension') {
          agent {
            dockerfile {
              filename 'services/QuillJenkins/agents/QuillComprehension/Dockerfile.test-ruby'
              dir '.'
              args '-u root:sudo -v $HOME/workspace/myproject:/myproject --name QuillComprehension-webapp --network jnk-net'
            }
          }
          environment {
            RACK_ENV = 'test'
          }
          steps {
            echo 'Beginnning TEST...'
            dir(path: 'services/QuillComprehension') {
              sh 'bundle install'
              sh 'yarn install'
              echo 'DB:'
              sh 'cp config/database.yml.jenkins config/database.yml'
              sh 'bin/rails db:create'
              sh 'bin/rails db:schema:load'
              echo 'Running rspec'
              sh 'bundle exec rspec'
              echo 'Running Jest'
              sh 'yarn test'
              echo 'Test successful!'
            }
          }
        }
        stage('test-quill-grammar') {
          agent {
            dockerfile {
              filename 'services/QuillJenkins/agents/Generic/Dockerfile.test-node'
              dir '.'
              args '-u root:sudo -v $HOME/workspace/myproject:/myproject --name quill-grammar'
            }
          }
          environment {
            NODE_ENV = 'test'
          }
          steps {
            echo 'Beginnning TEST...'
            dir(path: 'services/QuillGrammar') {
              sh 'npm install'
              echo 'Running Karma'
              sh 'npm run test'
              echo 'Test successful!'
            }
          }
        }
        stage('test-quill-marking-logic') {
          agent {
            dockerfile {
              filename 'services/QuillJenkins/agents/Generic/Dockerfile.test-node'
              dir '.'
              args '-u root:sudo -v $HOME/workspace/myproject:/myproject --name quill-marking-logic'
            }
          }
          environment {
            NODE_ENV = 'test'
          }
          steps {
            echo 'Beginnning TEST...'
            dir(path: 'packages/quill-marking-logic') {
              sh 'npm install'
              echo 'Running Karma'
              sh 'npm run test'
              echo 'Test successful!'
            }
          }
        }
        stage('test-quill-spellchecker') {
          agent {
            dockerfile {
              filename 'services/QuillJenkins/agents/Generic/Dockerfile.test-node'
              dir '.'
              args '-u root:sudo -v $HOME/workspace/myproject:/myproject --name quill-spellchecker'
            }
          }
          environment {
            NODE_ENV = 'test'
          }
          steps {
            echo 'Beginnning TEST...'
            dir(path: 'packages/quill-spellchecker') {
              sh 'npm install'
              echo 'Running Karma'
              sh 'npm run test'
              echo 'Test successful!'
            }
          }
        }
        stage('test-quill-connect') {
          agent {
            dockerfile {
              filename 'services/QuillJenkins/agents/QuillConnect/Dockerfile.test'
              dir '.'
              args '-u root:sudo -v $HOME/workspace/myproject:/myproject --name quill-connect'
            }
          }
          environment {
            NODE_ENV = 'test'
          }
          steps {
            echo 'Beginnning TEST...'
            dir(path: 'services/QuillConnect') {
              sh 'npm install'
              echo 'Running Mocha'
              sh 'npm run test'
              echo 'Test successful!'
            }
          }
        }
      }
    }
    stage('merge') {
      agent {
        label 'master'
      }
      steps {
        echo "Merging PR if possible..."
        script {
          /* only PRs have a change id */
          if (env.CHANGE_ID) {
            echo "Automatically merging pull request $env.CHANGE_ID into fake-develop..."
            echo "Pulling fake-develop..."

            def quillStaffId='509062'
            def checkEndpoint="https://api.github.com/repos/empirical-org/Empirical-Core/pulls/${env.CHANGE_ID}"
            def teamEndpoint="https://api.github.com/teams/${quillStaffId}/members"
            def payload='{\"commit_title\":\"Merged by jenkins.\", \"commit_message\":\"automatically merged by jenkins.\"}'
            def mergeEndpoint="https://api.github.com/repos/empirical-org/Empirical-Core/pulls/${env.CHANGE_ID}/merge"
            def headers = 'Content-Type: application/json'
            withCredentials([usernamePassword(credentialsId: 'robot-butler', usernameVariable: 'U', passwordVariable: 'T')]) {
              /* PERFORM MERGE CHECKS */

              /* fetch pr */
              sh "curl -X GET -u ${U}:${T} '${checkEndpoint}' > check"
              sh 'python -c "import json;f=open(\'check\');j=json.loads(f.read());print(j[\'user\'][\'login\']);f.close()" > tmp'
              def ghUser = readFile 'tmp'
              ghUser = ghUser.trim()
              sh 'python -c "import json;f=open(\'check\');j=json.loads(f.read());print(j[\'mergeable\']);f.close()" > tmp'
              def mergeable = readFile 'tmp'
              mergeable = mergeable.trim()

              sh 'python -c "import json;f=open(\'check\');j=json.loads(f.read());print(j[\'base\'][\'ref\']);f.close()" > tmp'
              def mergingInto = readFile 'tmp'
              mergingInto = mergingInto.trim()

              /* TODO: for test only, remove */
              if (mergingInto == 'master') {
                error('No merging into master in test mode!')
              }

              /* ensure PR is mergeable */
              if (!mergeable.equals('True')) {
                error("Not able to automatically merge branch! exiting.")
              }

              /* ensure branch to merge into is not master */
              if (env.CHANGE_BRANCH != 'fake-develop') {
                if (mergingInto == 'fake-master'){
                  error("Only the 'fake-develop' branch can merge directly into fake-master!")
                }
              }

              /* ensure user has permission for auto-merged requests */
              sh "curl -X GET -u ${U}:${T} '${teamEndpoint}' > team"
              sh "python -c \"import json;f=open('team');j=json.loads(f.read());print('${ghUser}' in [u['login'] for u in j])\" > tmp"
              def userOk = readFile 'tmp'
              userOk = userOk.trim()
              if (userOk != 'True') {
                error("This user does not have permission to start an automatic merge.")
              }

              /* MERGE THE PR */
              sh "curl -X PUT -u ${U}:${T} -H \"${headers}\" -d '${payload}' '${mergeEndpoint}' || exit"
              echo "Successfully merged PR ${env.CHANGE_BRANCH}."
            }
          }
          else {
            echo "Your branch is not fake-master, fake-develop, an open PR, or a branch with an open PR.  Nothing to do."
          }
        }
      }
    }
    stage('deploy') {
      parallel {
        stage('deploy-lms') {
          agent {
            label 'master'
          }
          steps {
            echo 'Beginnning LMS DEPLOY...'
            script {
              /* only PRs have a change id */
              if (env.CHANGE_ID) {
                def checkEndpoint="https://api.github.com/repos/empirical-org/Empirical-Core/pulls/${env.CHANGE_ID}"
                withCredentials([usernamePassword(credentialsId: 'robot-butler', usernameVariable: 'U', passwordVariable: 'T')]) {
                  /* DEPLOY LMS TO CORRECT LOCATION */

                  /* fetch PR to find branch it will merge into - determines
                   * staging /production deploy */
                  sh "curl -X GET -u ${U}:${T} '${checkEndpoint}' > check"
                  sh 'python -c "import json;f=open(\'check\');j=json.loads(f.read());print(j[\'base\'][\'ref\']);f.close()" > tmp'
                  def mergingInto = readFile 'tmp'
                  mergingInto = mergingInto.trim()

                  /* if branch target was fake-develop, deploy fake-develop to staging */
                  if (mergingInto == 'fake-develop') {
                    echo "Automatically deploying fake-develop to staging..."
                    /* heroku allows authentication through 'heroku login', http basic
                     * auth, and SSH keys.  Since right now this stage runs only on the
                     * Jenkins master node, we have simply pre-logged in the user with
                     * heroku login.  If this process needs to execute on a non-master
                     * node, consult
                     * https://devcenter.heroku.com/articles/git#http-git-authentication
                     */
                    def herokuStagingLMS="https://git.heroku.com/empirical-grammar-staging.git"
                    sh "git push -f ${herokuStagingLMS} `git subtree split --prefix services/QuillLMS HEAD`:master"
                  }
                  else if (mergingInto == 'fake-master') {
                    echo "Automatically deploying fake-master to production..."
                    echo "Warning: This behavior is not yet enabled with this pipeline."
                  }
                  else {
                    echo "No deploy stage for non-master / non-develop branch."
                  }
                }
              }
              else {
                echo "No deploy stage for non-PR."
              }
            }
          }
        }
        stage('deploy-connect') {
          agent {
            dockerfile {
              filename 'services/QuillJenkins/agents/QuillConnect/Dockerfile.deploy'
              dir '.'
              args '-u root:sudo -v $HOME/workspace/myproject:/myproject --name connect-deploy --network jnk-net'
            }
          }
          environment {
            QUILL_CMS='https://cms.quill.org'
            NODE_ENV='production'
            EMPIRICAL_BASE='https://www.quill.org'
            PUSHER_KEY=credentials('pusher-key-connect')
          }
          steps {
            echo "Beginnning connect deploy..."
            script {
              if (env.CHANGE_ID) {
                  if (mergingInto == 'fake-develop') {
                    echo "Adding staging.sh script to be run in the npm context..."
                    sh "echo 'webpack --optimize-minimize; firebase deploy --project production' > staging.sh"
                    echo "Deploying connect to staging..."
                    sh 'npm run deploy:staging'
                  }
                  else if (mergingInto == 'fake-master') {
                    echo "Automatically deploying fake-master to production..."
                    echo "Warning: This behavior is not yet enabled with this pipeline."
                  }
              }
              else {
                echo "Your branch is not fake-master, fake-develop, an open PR, or a branch with an open PR.  Nothing to do."
              }
            }
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

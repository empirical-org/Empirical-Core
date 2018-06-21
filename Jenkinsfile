pipeline {
  agent any
  stages {
    stage('set-pr-envars') {
      steps {
        script {
          env.MERGING_INTO=''
          env.MERGEABLE=''
          env.IS_PR='False'
          env.USER_IS_STAFF_MEMBER='False'
          if (env.CHANGE_ID) {
            env.IS_PR='True'
            def quillStaffId='509062'
            def checkEndpoint="https://api.github.com/repos/empirical-org/Empirical-Core/pulls/${env.CHANGE_ID}"
            def teamEndpoint="https://api.github.com/teams/${quillStaffId}/members"
            def payload='{\"commit_title\":\"Merged by jenkins.\", \"commit_message\":\"automatically merged by jenkins.\"}'
            def mergeEndpoint="https://api.github.com/repos/empirical-org/Empirical-Core/pulls/${env.CHANGE_ID}/merge"
            def headers = 'Content-Type: application/json'
            withCredentials([usernamePassword(credentialsId: 'robot-butler', usernameVariable: 'U', passwordVariable: 'T')]) {
              /* fetch pr */
              sh "curl -X GET -u ${U}:${T} '${checkEndpoint}' > check"
              sh 'python -c "import json;f=open(\'check\');j=json.loads(f.read());print(j[\'user\'][\'login\']);f.close()" > tmp'
              def ghUser = readFile 'tmp'
              ghUser = ghUser.trim()

              sh 'python -c "import json;f=open(\'check\');j=json.loads(f.read());print(j[\'mergeable\']);f.close()" > tmp'
              def mergeable = readFile 'tmp'
              env.MERGEABLE=mergeable.trim()

              sh 'python -c "import json;f=open(\'check\');j=json.loads(f.read());print(j[\'base\'][\'ref\']);f.close()" > tmp'
              def mergingInto = readFile 'tmp'
              env.MERGING_INTO=mergingInto.trim()

              /* ensure user has permission for auto-merged requests */
              sh "curl -X GET -u ${U}:${T} '${teamEndpoint}' > team"
              sh "python -c \"import json;f=open('team');j=json.loads(f.read());print('${ghUser}' in [u['login'] for u in j])\" > tmp"
              def userOk = readFile 'tmp'
              env.USER_IS_STAFF_MEMBER=userOk.trim() 
            }
          }
        }
      }
    }
    stage('start-postgres-docker') {
      steps {
        echo 'Starting postgres docker container...'
        script {
          sh "docker network create jnk-net${env.BUILD_TAG}"
          sh "docker run --name lms-testdb${env.BUILD_TAG} --network jnk-net${env.BUILD_TAG} -d postgres:10.1"
        }
      }
    }
    stage('test') {
      parallel {
        stage('test-lms-ruby') {
          agent {
            dockerfile {
              filename 'services/QuillJenkins/agents/QuillLMS/Dockerfile.test-ruby'
              dir '.'
              args "-u root:sudo -v \$HOME/workspace/myproject:/myproject --name test-lms-ruby${env.BUILD_TAG} --network jnk-net${env.BUILD_TAG}"
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
              //sh 'cp config/database.yml.jenkins config/database.yml'
              sh "config/generate_databaseyml.sh ${env.BUILD_TAG} config/database.yml" 
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
        stage('test-comprehension') {
          agent {
            dockerfile {
              filename 'services/QuillJenkins/agents/QuillComprehension/Dockerfile.test-ruby'
              dir '.'
              args "-u root:sudo -v \$HOME/workspace/myproject:/myproject --name test-comprehension${env.BUILD_TAG} --network jnk-net${env.BUILD_TAG}"
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
              //sh 'cp config/database.yml.jenkins config/database.yml'
              sh "config/generate_databaseyml.sh ${env.BUILD_TAG} config/database.yml" 
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
        stage('test-grammar') {
          agent {
            dockerfile {
              filename 'services/QuillJenkins/agents/Generic/Dockerfile.test-node'
              dir '.'
              args "-u root:sudo -v \$HOME/workspace/myproject:/myproject --name test-grammar${env.BUILD_TAG}"
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
        stage('test-marking-logic') {
          agent {
            dockerfile {
              filename 'services/QuillJenkins/agents/Generic/Dockerfile.test-node'
              dir '.'
              args "-u root:sudo -v \$HOME/workspace/myproject:/myproject --name test-marking-logic${env.BUILD_TAG}"
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
        stage('test-spellchecker') {
          agent {
            dockerfile {
              filename 'services/QuillJenkins/agents/Generic/Dockerfile.test-node'
              dir '.'
              args "-u root:sudo -v \$HOME/workspace/myproject:/myproject --name test-spellchecker${env.BUILD_TAG}"
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
        stage('test-connect') {
          agent {
            dockerfile {
              filename 'services/QuillJenkins/agents/QuillConnect/Dockerfile.test'
              dir '.'
              args "-u root:sudo -v \$HOME/workspace/myproject:/myproject --name test-connect${env.BUILD_TAG}"
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
          echo 'printing envars set earlier'
          echo env.MERGING_INTO
          echo env.MERGEABLE
          echo env.IS_PR
          echo env.USER_IS_STAFF_MEMBER
          echo 'end of envars'
          /* only PRs have a change id */
          if (env.IS_PR == 'True') {
            echo "Automatically merging pull request $env.CHANGE_ID into $env.MERGING_INTO..."

            def quillStaffId='509062'
            def checkEndpoint="https://api.github.com/repos/empirical-org/Empirical-Core/pulls/${env.CHANGE_ID}"
            def teamEndpoint="https://api.github.com/teams/${quillStaffId}/members"
            def payload='{\"commit_title\":\"Merged by jenkins.\", \"commit_message\":\"automatically merged by jenkins.\"}'
            def mergeEndpoint="https://api.github.com/repos/empirical-org/Empirical-Core/pulls/${env.CHANGE_ID}/merge"
            def headers = 'Content-Type: application/json'
            withCredentials([usernamePassword(credentialsId: 'robot-butler', usernameVariable: 'U', passwordVariable: 'T')]) {
              /* PERFORM MERGE CHECKS */

              /* TODO: for test only, remove */
              if (env.MERGING_INTO == 'master') {
                error('No merging into master in test mode!')
              }

              /* ensure PR is mergeable */
              if (!env.MERGEABLE.equals('True')) {
                error("Not able to automatically merge branch! exiting.")
              }

              /* ensure branch to merge into is not master */
              /* CHANGE_BRANCH is the source branch for a PR */
              if (env.CHANGE_BRANCH != 'develop') {
                if (env.MERGING_INTO == 'master') {
                  error("Only pull requests from the develop branch can merge directly into master!")
                }
              }

              if (env.USER_IS_STAFF_MEMBER != 'True') {
                error("This user does not have permission to start an automatic merge.")
              }

              /* MERGE THE PR */
              sh "curl -X PUT -u ${U}:${T} -H \"${headers}\" -d '${payload}' '${mergeEndpoint}' || exit"
              echo "Successfully merged ${env.GIT_BRANCH}: ${env.CHANGE_BRANCH} -> ${env.MERGING_INTO}"
            }
          }
          else {
            echo "Not a Pull Request; nothing to do."
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
              withCredentials([usernamePassword(credentialsId: 'robot-butler', usernameVariable: 'U', passwordVariable: 'T')]) {
                if (env.GIT_BRANCH == 'develop') {
                  echo "Automatically deploying develop to staging..."
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
                else if (env.GIT_BRANCH == 'master') {
                  echo "Automatically deploying master to production..."
                  echo "Warning: This behavior is not yet enabled with this pipeline."
                }
                else {
                  echo "No deploy stage for non-master / non-develop branch. If you submitted a PR to one of these branches, a build will be triggered."
                }
              }
            }
          }
        }
        stage('deploy-connect') {
          agent {
            dockerfile {
              filename 'services/QuillJenkins/agents/QuillConnect/Dockerfile.deploy'
              dir '.'
              args "-u root:sudo -v \$HOME/workspace/myproject:/myproject --name deploy-connect${env.BUILD_TAG} --network jnk-net${env.BUILD_TAG}"
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
              withCredentials([usernamePassword(credentialsId: 'robot-butler', usernameVariable: 'U', passwordVariable: 'T')]) {
                if (env.GIT_BRANCH == 'develop') {
                  echo "Adding staging.sh script to be run in the npm context..."
                  sh "echo 'webpack --optimize-minimize; firebase deploy --project production' > staging.sh"
                  echo "Deploying connect to staging..."
                  sh 'npm run deploy:staging'
                }
                else if (env.GIT_BRANCH == 'master') {
                  echo "Automatically deploying master to production..."
                  echo "Warning: This behavior is not yet enabled with this pipeline."
                }
                else {
                  echo "No deploy stage for non-master / non-develop branch. If you submitted a PR to one of these branches, a build will be triggered."
                }
              }
            }
          }
        }
      }
    }
    stage('trigger-destination-branch-builds') {
      /* after a pr is successfully merged, build the destination branch */
      /* https://www.ittybittytalks.com/how-to-automate-your-jenkins-build-script/ */
      steps {
        script {
          if (env.IS_PR == 'True') {
            withCredentials([usernamePassword(credentialsId: 'jenkins-api', usernameVariable: 'U', passwordVariable: 'T')]) {
              echo "Trigging destination branch build for ${env.MERGING_INTO}..."
              sh "curl -X POST -u ${U}:${T} https://jenkins.quill.org/job/quill.org/job/${env.MERGING_INTO}/build || exit"
              // https://jenkins.quill.org/job/quill.org/job/develop/build?delay=0sec
            }
          }
          else {
            echo "Only PRs trigger destination branch builds; nothing to do."
          }
        }
      }
    }
  }
  post {
    always {
      echo 'Stopping postgres docker container...'
      sh "docker stop lms-testdb${env.BUILD_TAG}"
      sh "docker rm lms-testdb${env.BUILD_TAG}"
      sh "docker network rm jnk-net${env.BUILD_TAG}"
    }
  }
}

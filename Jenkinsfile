pipeline {
  agent any
  stages {
    stage('deploy') {
      steps {
        echo 'Beginnning DEPLOY...'
        script {
          if ("$env.CHANGE_ID" && "$env.CHANGE_BRANCH" == 'fake-develop') {
            echo "Automatically merging pull request $env.CHANGE_ID into fake-master..."
          }
          else if ("$env.CHANGE_ID") {
            echo "Automatically merging pull request $env.CHANGE_ID into fake-develop..."
          }
          else if ("$env.BRANCH_NAME" == 'fake-develop') {
            echo "Automatically deploying fake-develop to staging..."
          }
          else if ("$env.BRANCH_NAME" == 'fake-master') {
            echo "Automatically deploying fake-master to production..."
          }
          else {
            echo "Your branch is not fake-master, fake-develop, an open PR, or a branch with an open PR.  Nothing to do."
          }
        }
      }
    }
  }
}


pipeline {
  agent any
  stages {
    stage('deploy') {
      steps {
        echo 'Beginnning DEPLOY...'
        script {
          if (env.CHANGE_ID && env.CHANGE_BRANCH == 'fake-develop') {
            echo "Automatically merging pull request $env.CHANGE_ID into fake-master..."
          }
          else if (env.CHANGE_ID) {
            echo "Automatically merging pull request $env.CHANGE_ID into fake-develop..."
            echo "Pulling fake-develop..."
            def payload='{\"commit_title\":\"Merged by jenkins.\", \"commit_message\":\"automatically merged by jenkins.\"}'
            def mergeEndpoint="https://api.github.com/repos/empirical-org/Empirical-Core/pulls/${env.CHANGE_ID}/merge"
            def headers = 'Content-Type: application/json'
            withCredentials([usernamePassword(credentialsId: 'robot-butler', usernameVariable: 'U', passwordVariable: 'T')]) {
              sh "curl -X PUT -u ${U}:${T} -H \"${headers}\" -d '${payload}' '${mergeEndpoint}'"
            }
            

          }
          else if (env.BRANCH_NAME == 'fake-develop') {
            echo "Automatically deploying fake-develop to staging..."
          }
          else if (env.BRANCH_NAME == 'fake-master') {
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


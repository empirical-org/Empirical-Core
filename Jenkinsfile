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

            /* merge check */
            def quillStaffId='509062'
            def checkEndpoint="https://api.github.com/repos/empirical-org/Empirical-Core/pulls/${env.CHANGE_ID}"
            def teamEndpoint="https://api.github.com/teams/${quillStaffId}/members"
            withCredentials([usernamePassword(credentialsId: 'robot-butler', usernameVariable: 'U', passwordVariable: 'T')]) {
              /* fetch pr */
              sh "curl -X GET -u ${U}:${T} '${checkEndpoint}' > check"
              sh 'python -c "import json;f=open(\'check\');j=json.loads(f.read());print(j[\'user\'][\'login\']);f.close()" > tmp'
              def ghUser = readFile 'tmp'
              sh 'python -c "import json;f=open(\'check\');j=json.loads(f.read());print(j[\'mergeable\']);f.close()" > tmp'
              def mergeable = readFile 'tmp'
              sh 'python -c "import json;f=open(\'check\');j=json.loads(f.read());print(j[\'base\'][\'ref\']);f.close()" > tmp'
              def mergingInto = readFile 'tmp'

              /* ensure PR is mergeable */ 
              if (mergeable != 'True') {
                error("Not able to automatically merge branch! exiting.")
              }

              /* ensure branch to merge into is not master */
              if (mergingInto == 'master') {
                error("Only the 'develop' branch can merge directly into master!")
              }
              
              /* ensure user has permission for auto-merged requests */
              sh "curl -X GET -u ${U}:${T} '${teamEndpoint}' > team"
              sh "python -c \"import json;f=open('team');j=json.loads(f.read());print(${ghUser} in [u['login'] for u in j])\" > tmp"
              def userOk = readFile 'tmp'
              if (userOk != 'True') {
                error("This user does not have permission to start an automatic merge.")
              }
            }

            /* merge */
            def payload='{\"commit_title\":\"Merged by jenkins.\", \"commit_message\":\"automatically merged by jenkins.\"}'
            def mergeEndpoint="https://api.github.com/repos/empirical-org/Empirical-Core/pulls/${env.CHANGE_ID}/merge"
            def headers = 'Content-Type: application/json'
            withCredentials([usernamePassword(credentialsId: 'robot-butler', usernameVariable: 'U', passwordVariable: 'T')]) {
              sh "curl -X PUT -u ${U}:${T} -H \"${headers}\" -d '${payload}' '${mergeEndpoint}'"
            }
          }
          else if (env.BRANCH_NAME == 'fake-develop') {
            echo "Automatically deploying fake-develop to staging..."
            def herokuLMS="https://git.heroku.com/empirical-grammar-staging.git"
            /* git push -f ${herokuLMS} `git subtree split --prefix services/QuillLMS HEAD`:master */
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


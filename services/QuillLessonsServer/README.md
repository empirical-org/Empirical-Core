# Quill Lessons Server

## Local Setup

### Configure everything for local execution
- Get a dump of the RethinkDB to see your local database with.
  1.  Log in to Compose.io.
  1. Navigate to the production database instance ("quill-lessons")
  1. Select "Backups" from the side menu
  1. Click the download icon next to the most recent daily backup (technically you could pick any backup file you want, but no reason not to grab the latest).  Make sure that you know where this file ends up getting downloaded to.
- Run `./bootstrap.sh`
  1. You will be asked to provide the path to the RethinkDB dump file that you downloaded (it should be in .tar format).
- Configure Local LMS to Launch Local Lessons
  1. Using either the QuillLMS Rails Console, or a direct database connection, you need to update the values in the ActivityClassification records (SQL dtable name "activity_classification").  For the row corresponding to Lessons (name = "Quill Lessons"), update both the `form_url` and the `module_url` values so that their hosts point at `http://localhost:8090/`.

### Running Lessons locally

1. Start the Quill Lessons server by executing `npm run start:dev`.  This will spin up your local RethinkDB server, and then connect your local QuillLessons server to it.  Note that using ctrl-c to stop the server will also stop your local RethinkDB instance.
1. You will also need the QuillLMS running to generate the JWT needed to authenticate connections to the QuillLessonsServer. In another terminal window, navigate to ../QuillLMS and execute `foremand start -f Procfile.static`
1. Once the two base servers are running, make sure that your local lessons client is also up.  In yet another terminal window navigate to ../QuillLessons and execute `npm run start:dev`.

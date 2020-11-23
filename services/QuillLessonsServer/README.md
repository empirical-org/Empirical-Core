# Quill Lessons Server

## Installation / Setup

### Configure everything for local execution

- Get a dump of the RethinkDB to see your local database with.
  1. Log in to Compose.io.
  2. Navigate to the production database instance ("quill-lessons")
  3. Select "Backups" from the side menu
  4. Click the download icon next to the most recent daily backup (technically you could pick any backup file you want, but no reason not to grab the latest). Make sure that you know where this file ends up getting downloaded to.
  - Note that the dump file you download must be in JSON format for `bootstrap.sh` to parse it properly. JSON is currently the default (and only) option from Compose.io.
- Run `./bootstrap.sh`
  1. You will be asked to provide the path to the RethinkDB dump file that you downloaded (it should be in .tar format).
  1. If you get the following error: `Error when launching 'rethinkdb-store': No such file or directory`, you may need to configure the RethinkDB Python driver. Run the following commands:
  - `python -V` to check your local version
  - for Python 2, run: `sudo pip install virtualenv && virtualenv ./venv`
  - for Python 3, run: `python3 -m venv ./venv`
  - `source venv/bin/activate`
  - `pip install rethinkdb`
  - rerun `./bootstrap.sh`
- Configure Local LMS to Launch Local Lessons
  1. Using either the QuillLMS Rails Console, or a direct database connection, you need to update the values in the ActivityClassification records (SQL dtable name "activity_classification"). For the row corresponding to Lessons (name = "Quill Lessons") or `ActivityClassification.find(6)` in the Rails console, update `form_url` to `http://localhost:3000/lessons/#/` and `module_url` to `http://localhost:3000/lessons/#/play/class-lessons/`.

### Running Lessons locally

1. You will need the QuillLMS running to generate the JWT needed to authenticate connections to the QuillLessonsServer. In a new terminal window, navigate to ../QuillLMS and execute `npm run start:dev`.
1. In a new terminal window, start the Quill Lessons server by executing `npm run start:dev`.  This will spin up your local RethinkDB server, and then connect your local QuillLessons server to it.  Note that using ctrl-c to stop the server will also stop your local RethinkDB instance.


## Test Suite
If you'd like to run tests:
```
$ jest
```

## Deployment
```bash
bash deploy.sh prod|staging
```

## Infrastructure
TBD
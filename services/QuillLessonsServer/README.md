# Quill Lessons Server

## Local Setup

### Configure everything for local execution

- Get a dump of the RethinkDB to see your local database with.
  1. Log in to Compose.io.
  2. Navigate to the production database instance ("quill-lessons")
  3. Select "Backups" from the side menu
  4. Click the download icon next to the most recent daily backup (technically you could pick any backup file you want, but no reason not to grab the latest). Make sure that you know where this file ends up getting downloaded to.
  - Note that the dump file you download must be in JSON format for `bootstrap.sh` to parse it properly. JSON is currently the default (and only) option from Compose.io.
- Make sure you have a `JWT_PUBLIC_KEY` in your `.env` file.
- Run `./bootstrap.sh`
  1. You will be asked to provide the path to the RethinkDB dump file that you downloaded (it should be in .tar format).
  2. If you get the following error: `Error when launching 'rethinkdb-store': No such file or directory`, you may need to configure the RethinkDB Python driver. Run the following commands:
  - `python --V` to check your local version
  - for Python 2, run: `sudo pip install virtualenv && virtualenv ./venv`
  - for Python 3, run: `python3 -m venv ./venv`
  - `source venv/bin/activate`
  - `pip install rethinkdb`
  - rerun `./bootstrap.sh`
- Configure Local LMS to Launch Local Lessons
  1. Using either the QuillLMS Rails Console, or a direct database connection, you need to update the values in the ActivityClassification records (SQL dtable name "activity_classification"). For the row corresponding to Lessons (name = "Quill Lessons") or `ActivitiyClassification.find(6)` in the Rails console, update `form_url` to `http://localhost:8090/#/` and `module_url` to `http://localhost:8090/#/play/class-lessons/`.

### Running Lessons locally

1. Start the Quill Lessons server by executing `npm run start:dev`. This will spin up your local RethinkDB server, and then connect your local QuillLessons server to it. Note that using ctrl-c to stop the server will also stop your local RethinkDB instance.
2. You will also need the QuillLMS running to generate the JWT needed to authenticate connections to the QuillLessonsServer. In another terminal window, navigate to ../QuillLMS and execute `npm run start:dev`
3. Once the two base servers are running, make sure that your local lessons client is also up. In yet another terminal window navigate to ../QuillLessons and execute `npm run start:dev`.

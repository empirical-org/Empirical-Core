# Quill Lessons Server

## Local Setup

Unless otherwise noted, all commands should be executed from the directory that contains this README file.

### Install RethinkDB

Download and install [RethinkDB](https://www.rethinkdb.com/), the realtime database QuillLessonsServer uses. Installation instructions are available on the RethinkDB [installation guide](https://rethinkdb.com/docs/install/).

If you're more comfortable with installing custom software, you can use [homebrew](http://brew.sh/) to download and install RethinkDB instead using the following commands:

    $ brew update
    $ brew install rethinkdb

### Seed RethinkDB with Lessons data

1. Log in to Compose.io.
1. Navigate to the production database instance ("quill-lessons")
1. Select "Backups" from the side menu
1. Click the download icon next to the most recent daily backup (technically you could pick any backup file you want, but no reason not to grab the latest).  Make sure that you know where this file ends up getting downloaded to.
1. Execute `./rethink_local.sh start` to start your local RehinkDB instance
1. Execute `rethink restore /path/to/downloaded/backup/file` to copy production data into your local RethinkDB instance
1. Execute `./rethink_local.sh stop` to shut down your local RethinkDB instance for the time being

### Generate RSA Keys
Open ruby console `$ irb`
Generate the keys in the irb console:
```
require 'OpenSSL'
=> true
keys = OpenSSL::PKey::RSA.new 2048
=> #<OpenSSL::PKey::RSA:0x007fea56a71af0>
```
Get and copy the private key to an environment variable for the QuillLMS Rails app:
```
$ keys.to_s
=> "-----BEGIN RSA PRIVATE KEY-----<private_key_here>-----END RSA PRIVATE KEY-----\n"
```
Copy the entire private key unaltered, including the double quotes and and paste it in the `.env` file for the LMS application. The path of this file relative to Empirical-Core root directory is `services/QuillLMS/.env`.
```
LESSONS_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----<private_key_here>.-----END RSA PRIVATE KEY-----\n"
```

Execute the command `cp nodemon.json.example nodemon.json` in order to seed your local nodemon config with the necessary structure for setting environment variables.

Copy the entire public key unaltered, and paste it in as the value for the "JWT_PUBLIC_KEY" which currently holds placeholder text.

### Configure Local LMS to Launch Local Lessons

In order to launch your local version of Lessons from within your local LMS instance, we need to make some updates.

Using either the Rails Console, or a direct database connection, you need to update the values in the ActivityClassification records (SQL dtable name "activity_classification").  For the row corresponding to Lessons (name = "Quill Lessons"), update both the `form_url` and the `module_url` values so that their hosts point at `http://localhost:8090/`.

### Start the Servers

1. Start the Quill Lessons server by executing `npm run start:dev`.  This will spin up your local RethinkDB server, and then connect your local QuillLessons server to it.  Note that using ctrl-c to stop the server will also stop your local RethinkDB instance.
1. You will also need the QuillLMS running to generate the JWT needed to authenticate connections to the QuillLessonsServer. In another terminal window, navigate to ../QuillLMS and execute `foremand start -f Procfile.static`
1. Once the two base servers are running, make sure that your local lessons client is also up.  In yet another terminal window navigate to ../QuillLessons and execute `npm run start:dev`.

For more information, see the Quill [docs](https://docs.quill.org/tools/lessons_server.html).

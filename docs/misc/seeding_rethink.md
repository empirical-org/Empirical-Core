# Seeding Rethink

## Download Data to Import Into RethinkDB from Firebase

```
cd services/QuillLMS
rails runner script/lessons/00_download_rethink_import_data.rb
```

This should create the following four files:
```
services/QuillLMS/tmp/lessons.json
services/QuillLMS/tmp/metadata.json
services/QuillLMS/tmp/edition_questions.json
services/QuillLMS/tmp/reviews.json
```

## Upload Import Data to S3
Upload the above files to the `https://s3.amazonaws.com/quill-tmp` bucket. Permission should be set to public for reading these files.

## Import Data into RethinkDB
1. Sign into the `devtools@quill.org` compose.io account
2. Click on `quill-lessons` RethinkDB deployment
3. Copy the username and password for this deployment
4. Click on `Browser` on the left side panel
5. Open Admin UI and sign in using the username and password
6. Click on `Data Explorer` tab
7. Paste the following import statements into the console one by one clicking `run` after each:

```
r.db('quill_lessons').table('classroom_lessons').insert(r.http('https://s3.amazonaws.com/quill-tmp/lessons.json', {resultFormat:'json'}), {conflict:'replace'})

r.db('quill_lessons').table('lesson_edition_metadata').insert(r.http('https://s3.amazonaws.com/quill-tmp/metadata.json', {resultFormat:'json'}), {conflict:'replace'})

r.db('quill_lessons').table('lesson_edition_questions').insert(r.http('https://s3.amazonaws.com/quill-tmp/edition_questions.json', {resultFormat:'json'}), {conflict:'replace'})

r.db('quill_lessons').table('reviews').insert(r.http('https://s3.amazonaws.com/quill-tmp/reviews.json', {resultFormat:'json'}), {conflict:'replace'})
```

## Delete the Uploaded Files on S3
Then that is it!

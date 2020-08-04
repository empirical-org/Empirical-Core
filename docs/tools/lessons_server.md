# quill-connect-db

## Local Setup

### Install RethinkDB

Download and install [RethinkDB](https://www.rethinkdb.com/), the realtime database QuillLessonsServer uses. Installation instructions are available on the RethinkDB [installation guide](https://rethinkdb.com/docs/install/).

If you're more comfortable with installing custom software, you can use [homebrew](http://brew.sh/) to download and install RethinkDB instead using the following commands:

    $ brew update
    $ brew install rethinkdb

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
Copy the entire private key unaltered, including the double quotes and and paste it in `.env` file. The path of this file relative to Empirical-Core root directory is `services/QuillLMS/.env`.
```
LESSONS_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----<private_key_here>.-----END RSA PRIVATE KEY-----\n"
```

Write the public key to a file in the root directory of the QuillLessonsServer. Note path below is relative to root directory of the Empirical-Core mono-repo:

```
File.open("services/QuillLessonsServer/jwt-public-key.crt", 'w') do |file|
  file.write(keys.public_key.to_s)
end
```
### Start the Servers
In the root directory of QuillLMS run the following to start all processes needed to run the lessons server.
```
$ foreman start -f Procfile.lessons
```
This will start RethinkDB listening at port 9000, the QuilLessonsServer Node process at port 8000, and a hot reloading QuillLessons client at port 8080.

You will also need the QuillLMS to run to generate the JWT needed to authenticate connections to the QuillLessonsServer. In another terminal window run the following:
```
$ foreman start -f Procfile.static
```
Navigate your browser to `http://localhost:3000/lessons/#/admin` to confirm things are working.

# Empirical Easy Install

*Here is a simplified verision of Empirical Core for fixing smaller bugs.*

This branch contains the basics of setting up the application -- it comes with a database.yml file, which everyone will need in order for it the app to properly connect to the database. It contains a basic setup task that should create the database, give it the proper structure, and import some basic data into it. The rake task is called "setup" and can be invoked from the commandline with "bundle exec rake setup".

Users will still need to clone the app, switch to the proper branch, download and install postgres, download and install the proper version of Ruby, and run bundle install in the app directory for the rake setup task to actually work. 

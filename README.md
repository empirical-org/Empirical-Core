# Welcome to the Quill universe.

Each package and service in our repository has its own idiosycracies that will
be documented in it's own README.  To get started as an open source developer or
staff member, we request that you install the git hooks for this repository by
running this in the top level of this repository.

```bash
export QROOT=$(git rev-parse --show-toplevel)
ln -s $QROOT/meta/hooks/pre-commit $QROOT/.git/hooks/pre-commit
```
*Install hooks*


## Structure

If you've installed the repository hooks, it's time to start writing code that
will help a student become a better writer. Here is a quick overview of where to
find what you're looking for.
 
- **services**. Quill's services run on a server and our available to the world.
  QuillLMS, our flagship rails app, lives here.
- **packages**. Packages can be backend Quill apps that serve the front-end, or
  utilities that are used or have been used in Quill. Some of these packages are
  generalized so they can be easily used in 3rd party applications.

## Getting started

Make sure you've installed the repository hooks and understand the Quill
universe structure.  Checking out open issues is a great way to get started as
an open source contributor.


Thanks for your interest in Quill! 



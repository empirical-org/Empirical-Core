# Welcome to the Quill!

This is [Quill.org](https://www.quill.org/) monorepo. This repo contains the code that powers [Quill.org](https://www.quill.org/) and its learning tools.

## Overview

Here is a quick overview of the monorepo. Quill.org relies on a handful of applications. Here are the main ones:

### [QuillLMS (Learning Management System)](services/QuillLMS/README.md)

Quill LMS (Learning Management System) is the main application in the repo (95% of the code in the repo lives here). This is where Quill teachers, students, classes, activities, questions, reports, etc. are all managed.

The Quill LMS is a [Ruby on Rails](https://rubyonrails.org/) application (v4.2). This application is backed by a Postgres database. Note, we've started to use [Rails Engines](https://guides.rubyonrails.org/engines.html) to organize some newer code in the [`engines/`](services/QuillLMS/engines/) directory.

Most of the Quill LMS frontend javascript code is written in [React](https://reactjs.org/) and lives in the [`/client`](services/QuillLMS/client) directory. The React code is organized into a few main `bundles` [here](services/QuillLMS/client/app/bundles) based on learning tool and use.

The frontends for the Quill Learning Tools are contained in the Quill LMS:
Learning Tool | Demo | LMS Code
--|-|--
Quill Connect  | [demo](https://www.quill.org/tools/connect) | [code](services/QuillLMS/client/app/bundles/Connect)
Quill Lessons | [demo](https://www.quill.org/tools/lessons) | [code](services/QuillLMS/client/app/bundles/Lessons)
Quill Diagnostic | [demo](https://www.quill.org/tools/diagnostic) | [code](services/QuillLMS/client/app/bundles/Diagnostic)
Quill Proofreader | [demo](https://www.quill.org/tools/proofreader) | [code](services/QuillLMS/client/app/bundles/Proofreader)
Quill Grammar | [demo](https://www.quill.org/tools/grammar) | [code](services/QuillLMS/client/app/bundles/Grammar)

### [QuillCMS](services/QuillCMS/README.md)

The Quill CMS is a small service application to store student responses for analysis. This data is stored separately from the Quill LMS to separate it from data that might have [PII](https://en.wikipedia.org/wiki/Personal_data).

The Quill CMS is a [Ruby on Rails](https://rubyonrails.org/) application (v6.1) that supports a handful of API endpoints. This application is backed by a Postgres Database and has no frontend (html,css,javascript) code as it's purely an API service.

### [QuillLessonsServer](services/QuillLessonsServer/README.md)

QuillLessonsServer is a real-time application that supports our in-classroom product Quill Lessons. It is a [Node.js](https://nodejs.org/en/) application backed by a [RethinkDB](https://rethinkdb.com/) data store. It is an API-only application that makes heavy use of [socket.io](https://socket.io/)


### Other

As mentioned above, this repo is most of the code we use day-to-day at Quill. Outside of the main applications, there are some smaller code items:
- Small javascript libraries live in [packages](packages/).
- There are some serverless functions in [lambdas](lambdas/).
- One-off scripts live in [scripts/](scripts/)

## Getting started

Checking out open issues is a great way to get started as an open source contributor. Also, if you are just touring the codebase, I'd start with [QuillLMS](services/QuillLMS/README.md).

## Contributing
[contributing guide](CONTRIBUTING.md)

Note, we have style guides for [Ruby](https://github.com/empirical-org/ruby) and [Javascript](https://github.com/empirical-org/javascript) and a [Code of Conduct](CODE_OF_CONDUCT.md)

Thanks for your interest in Quill.org!!!

## Accessibility testing
We use [Assistiv](https://assistivlabs.com) to test our website for compatibility with screenreaders and other assistive software.

[![Code Climate](https://codeclimate.com/github/empirical-org/quill.png)](https://codeclimate.com/github/empirical-org/quill)
[![Build Status](https://travis-ci.org/empirical-org/quill.png)](https://travis-ci.org/empirical-org/quill)
[![Coverage Status](https://coveralls.io/repos/empirical-org/quill/badge.png?branch=master)](https://coveralls.io/r/empirical-org/quill?branch=master)
[![Dependency Status](https://gemnasium.com/empirical-org/quill.png)](https://gemnasium.com/empirical-org/quill)


### Benchmarking:
```
user = User.first
user.refresh_token!
token = user.token

$ ab -H "Authorization: Basic \`echo TOKEN_GOES_HERE: | base64\`==" -n 5 -c 1 http://www.quill.org/profile
```

[![Code Climate](https://codeclimate.com/github/empirical-org/quill.png)](https://codeclimate.com/github/empirical-org/quill)
[![Build Status](https://travis-ci.org/empirical-org/quill.png)](https://travis-ci.org/empirical-org/quill)
[![Coverage Status](https://coveralls.io/repos/empirical-org/quill/badge.png?branch=master)](https://coveralls.io/r/empirical-org/quill?branch=master)
[![Dependency Status](https://gemnasium.com/empirical-org/quill.png)](https://gemnasium.com/empirical-org/quill)


### Benchmarking:
```
user = User.first
user.refresh_token!
token = user.token

$ ab -H "Authorization: Basic `echo TOKEN_GOES_HERE: | base64`==" -n 5 -c 1 http://www.quill.org/profile
```

Communication
-------------
Communication between a team is important. One method we use is [IRC](http://en.wikipedia.org/wiki/Internet_Relay_Chat). If you would like to connect, you need an IRC client. Do some research on what clients are out there for your operating system. There are many to pick from.

Some suggestions are [HexChat](http://hexchat.github.io/), [Colloquy](http://colloquy.info/), and [Irssi](http://www.irssi.org/).

Once you launch your client, you should go ahead and set up some things, like registering your nick. Usually this can be done by typine '/msg nickserv register password email'. Then follow the rest of the instructions to get your nick registered. You can change your nick by using '/nick UberCoolNickname'.

The channel we use is #empirical-quill on Freenode. Freenode is one of the best IRC networks around, and it suits our purpose well.

We look forward to seeing you all there!
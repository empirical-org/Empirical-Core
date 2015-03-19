### Contributing Guidelines

See http://empirical-core.readme.io/v1.0 for documentation.

1.  Check our [Github issue queue](https://github.com/empirical-org/Compass/issues?state=open) for ideas on how to help.
2.  Make sure your code follows [Ruby](https://github.com/styleguide/ruby) and project conventions.
3.  Make sure you don't have any IDE / platform specific files committed. i.e.
    `.DS_Store`, `.idea`, `.project` (consider adding these to a [global gitignore](https://help.github.com/articles/ignoring-files#global-gitignore)).
4.  Before commiting, run `rake`, make sure all tests pass.
5.  Introduce changes with pull requests.


* Use ERB rather than HAML or SLIM.
* Write JavaScript, not CoffeeScript.
* Always write tests (the test suite is really bare right now) and nothing is to be merged without tests.
* Make pull requests on the develop branch.
* Use a minimalist approach to using gems like devise, FactoryGirl, etc, unless they're absolutely needed.


***

*the text below is copied from https://github.com/thoughtbot/factory_girl_rails/blob/master/CONTRIBUTING.md. Using this as a good starting point:*

We love pull requests. Here's a quick guide:

1. Fork the repo.

2. Run the tests. We only take pull requests with passing tests, and it's great
to know that you have a clean slate: `bundle && rake`

3. Add a test for your change. Only refactoring and documentation changes
require no new tests. If you are adding functionality or fixing a bug, we need
a test!

4. Make the test pass.

5. Push to your fork and submit a pull request.


At this point you're waiting on us. We like to at least comment on, if not
accept, pull requests within three business days (and, typically, one business
day). We may suggest some changes or improvements or alternatives.

Some things that will increase the chance that your pull request is accepted,
taken straight from the Ruby on Rails guide:

* Use Rails idioms and helpers
* Include tests that fail without your code, and pass with it
* Update the documentation, the surrounding one, examples elsewhere, guides,
  whatever is affected by your contribution

Syntax:

* Two spaces, no tabs.
* No trailing whitespace. Blank lines should not have any space.
* Prefer &&/|| over and/or.
* MyClass.my_method(my_arg) not my_method( my_arg ) or my_method my_arg.
* a = b and not a=b.
* Follow the conventions you see used in the source already.

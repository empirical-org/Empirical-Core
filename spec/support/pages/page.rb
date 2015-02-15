# cf http://www.neo.com/2014/10/17/clean-up-after-your-capybara
class Page
  extend Capybara::DSL
  include Capybara::DSL
end

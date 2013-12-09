desc "This task is called by the Heroku cron add-on"
task :call_page => :environment do
  uri = URI.parse('http://empirical-grammar.herokuapp.com/')
  Net::HTTP.get(uri)
  uri = URI.parse('http://empirical-discourse.herokuapp.com/')
  Net::HTTP.get(uri)
end

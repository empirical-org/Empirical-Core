#Prevents rack timeout from causing issues with active DB connections.
ActiveRecord::Base.configurations[Rails.env].merge!(prepared_statements: false)

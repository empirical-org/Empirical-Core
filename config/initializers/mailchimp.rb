module MailchimpConnection
  def connection
    Mailchimp::API.new(ENV['MAILCHIMP_API_KEY'])
  end

  extend self
end

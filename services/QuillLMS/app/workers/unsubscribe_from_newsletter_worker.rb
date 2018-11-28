class UnsubscribeFromNewsletterWorker
  include Sidekiq::Worker

  SENDGRID_NEWSLETTER_LIST = '1372437'

  def perform(recipient_id)
    @recipient = User.find recipient_id
    remove_recipient_from_list
  end

  def remove_recipient_from_list
    url = URI("https://api.sendgrid.com/v3/contactdb/lists/#{SENDGRID_NEWSLETTER_LIST}/recipients/#{@recipient_id}")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Delete.new(url)
    request["authorization"] = "Bearer #{ENV['SENDGRID_KEY']}"
    request.body = "null"

    response = http.request(request)
  end

end

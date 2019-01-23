class UnsubscribeFromNewsletterWorker
  include Sidekiq::Worker

  def perform(recipient_id)
    @recipient = User.find recipient_id
    remove_recipient_from_list
  end

  def remove_recipient_from_list
    get_url = URI("https://api.sendgrid.com/v3/contactdb/recipients/search?email=#{@recipient.email}")
    http = Net::HTTP.new(get_url.host, get_url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    get_request = Net::HTTP::Get.new(get_url)
    get_request["authorization"] = "Bearer #{ENV['SENDGRID_KEY']}"
    get_request.body = "null"

    get_response = http.request(get_request)
    if JSON.parse(get_response.body)['recipients']
      sendgrid_recipient = JSON.parse(get_response.body)['recipients'].first

      delete_url = URI("https://api.sendgrid.com/v3/contactdb/recipients/#{sendgrid_recipient['id']}")
      http = Net::HTTP.new(delete_url.host, delete_url.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE

      delete_request = Net::HTTP::Delete.new(delete_url)
      delete_request["authorization"] = "Bearer #{ENV['SENDGRID_KEY']}"
      delete_request.body = "null"

      response = http.request(delete_request)
    end
  end

end

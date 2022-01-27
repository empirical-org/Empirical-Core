# frozen_string_literal: true

class SubscribeToNewsletterWorker
  include Sidekiq::Worker

  SENDGRID_NEWSLETTER_LIST = '1372437'

  def perform(recipient_id)
    @recipient = User.find recipient_id
    add_recipient_to_contacts
    return unless @recipient.send_newsletter

    add_recipient_to_list
  end

  def add_recipient_to_contacts
    url = URI("https://api.sendgrid.com/v3/contactdb/recipients")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Post.new(url)
    request["authorization"] = "Bearer #{ENV['SENDGRID_KEY']}"
    request["content-type"] = 'application/json'
    request.body = "[{\"email\":\"#{@recipient.email}\",\"first_name\":\"#{@recipient.first_name}\",\"last_name\":\"User\"}]"
    response = http.request(request)
    @recipient_id = JSON.parse(response.read_body)["persisted_recipients"]&.first
  end

  def add_recipient_to_list
    url = URI("https://api.sendgrid.com/v3/contactdb/lists/#{SENDGRID_NEWSLETTER_LIST}/recipients/#{@recipient_id}")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Post.new(url)
    request["authorization"] = "Bearer #{ENV['SENDGRID_KEY']}"
    request.body = "null"

    response = http.request(request)
  end
end

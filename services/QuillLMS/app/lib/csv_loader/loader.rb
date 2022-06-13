# frozen_string_literal: true

gem 'google-api-client'
gem 'launchy'
gem 'activesupport'

require 'google/api_client'
require 'google/api_client/client_secrets'
require 'google/api_client/auth/installed_app'
require 'launchy'
require 'active_support/core_ext/module/delegation'

OAUTH_SCOPE = 'https://www.googleapis.com/auth/drive'
REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'

class GoogleDriveLoader
  # Initialize the client.
  def client
    return @client if defined? @client

    @client = Google::APIClient.new(
      application_name: 'Example Ruby application',
      application_version: '1.0.0'
    )

    authorize!
    @client
  end

  # Initialize Google+ API. Note this will make a request to the
  # discovery service every time, so be sure to use serialization
  # in your production code. Check the samples for more details.
  def drive
    client.discovered_api('drive', 'v2')
  end

  # Load client secrets from your client_secrets.json.
  def client_secrets
    Google::APIClient::ClientSecrets.load
  end

  # Request authorization
  def authorize!
    client.authorization.client_id     = client_secrets.client_id
    client.authorization.client_secret = client_secrets.client_secret
    client.authorization.scope         = OAUTH_SCOPE
    client.authorization.redirect_uri  = REDIRECT_URI

    # uri = client.authorization.authorization_uri

    # begin
    #   Launchy.open(uri)
    # rescue
    #   puts uri
    # end

    # # Exchange authorization code for access token
    # $stdout.write  "Enter authorization code: "
    # client.authorization.code = gets.chomp
    auth = {"access_token"=>
            "ya29.1.AADtN_W0xsGWc-TkqxlxE8f_xyok7kl3oM0XxAnWvZ_7EPTeAeSJINIoU0Y8gg",
            "token_type"=>"Bearer",
            "expires_in"=>3600,
            "refresh_token"=>"1/e7iTzkgqVstNgpGjdvvk-hWDB9x_YgyUQe2PMKhO2Qg"}

    client.authorization.code = nil
    client.authorization.issued_at = Time.current
    client.authorization.update_token!(auth)
  end

  def csv_files
    return @csv_files if defined? @csv_files

    res = client.execute(api_method: drive.children.list, parameters: {
      'folderId' => '0B2HguQEg6QQ1TnFCbUZ4UWZqVk0',
      'maxResults' => 1000
    })

    @csv_files = res.data.items
  end

  def files
    @files ||= csv_files.map{|f| GoogleDriveFile.new(self, f) }
  end
end

class GoogleDriveFile
  delegate :client, :drive, to: :@loader

  def initialize loader, child
    raise if loader.nil?

    @loader = loader
    @child = child
  end

  def doc
    @doc ||= client.execute(api_method: drive.files.get, parameters: {
      'fileId' => @child.id
    })
  end

  def download_url
    return @download_url if defined? @download_url

    data = doc.data
    @download_url = data.download_url || data.export_links['text/plain']
    #  if @download_url.blank?
    @download_url
  end

  def data
    res = client.execute(uri: download_url)
    res.body
  end
end

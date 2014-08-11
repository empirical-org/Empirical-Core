module Quill

  class Oauth < OAuth2::Client

    def initialize(client_id=nil, client_secret=nil, opts={}, &block)
      config = Configuration.new({}, site_url: 'http://www.quill.org/')
      super(client_id || config.client_id, client_secret || config.client_secret, opts.reverse_merge(site: config.site_url), &block)
    end
  end

end

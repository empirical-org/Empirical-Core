module UriParams
  def add_param(url, param_name, param_value)
    uri = URI(url)
    params = URI.decode_www_form(uri.query || []) << [param_name, param_value]
    uri.query = URI.encode_www_form(params)
    uri.to_s
  end

  def add_params url, params
    params.inject(url).each do |url_with_params, pair|
      key, value = pair
      add_param(url_with_params, key, value)
    end
  end

  extend self
end

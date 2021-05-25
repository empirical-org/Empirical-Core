class HardcodedDomainRewriter
  attr_accessor :url

  def initialize(url)
    @url = url
  end

  def run
    "#{domain}#{path}#{query}#{fragment}"
  end

  private def domain
    @domain ||= ENV['DEFAULT_URL']
  end

  private def fragment
    return '' if uri.fragment.blank?

    '#' + uri.fragment
  end

  private def path
    @path ||= uri.path
  end

  private def query
    return '' if uri.query.blank?

    '?' + uri.query
  end

  private def uri
    @uri ||= Addressable::URI.parse(url)
  end
end
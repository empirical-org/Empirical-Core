module CMS::Template
  extend self

  class InvalidOptionKey < Exception ; end

  def inject_options options
    "".tap { |s| options.each { |k,v| s << ", #{_validate_option_key(k)}: #{v.inspect}" } }
  end

  def add_comma content
    if content.strip.present?
      ", #{content}"
    else
      content
    end
  end

  private

  def _validate_option_key key
    unless key =~ /^[a-z0-9_]+$/
      raise CMS::Template::InvalidOptionKey, "Key #{key} is not valid."
    end

    key
  end
end

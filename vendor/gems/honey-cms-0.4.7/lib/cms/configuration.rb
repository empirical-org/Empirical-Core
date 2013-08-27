module CMS::Configuration
  extend self

  def data
    @data ||= if yaml_string_data.present?
      YAML.load(yaml_string_data).reverse_merge(default_empty_data)
    else
      default_empty_data
    end
  end

  def scoped_types options
    if options[:only]
      [types.find{|t| options[:only] == t.name}]
    else
      types.reject{|t| options[:except].include?(t.name)}
    end
  end

  def types
    if defined?(@types) then return @types end

    @types = data['content_types'].map do |name, config|
      CMS::Type.new(name, config.delete('attributes'), config)
    end

    @types.each do |type|
      type.attributes = attributes(type.attributes, type)
    end

    @types
  end

  def attributes attributes, type
    attributes.map do |args|
      options = args.extract_options!
      name = args.shift
      format = args.pop || options.delete('format')
      attribute = CMS::Attribute.new(name, format, options)
      attribute.reference_to.references << type if attribute.reference?
      attribute
    end
  end

  def pages
    data['pages'].map do |route, page_config|
      CMS::Page.new route.dup, HashWithIndifferentAccess.new(page_config)
    end
  end

  private

  def default_empty_data
    {
      'content_types' => [],
      'pages' => []
    }
  end

  def _load_yaml_string_data
    File.read(Rails.root.join 'config/cms.yml')
  rescue Errno::ENOENT
    nil
  end

  def _memoize_yaml_string_data
    return @_memoize_yaml_string_data if defined?(@_memoize_yaml_string_data)
    @_memoize_yaml_string_data = _load_yaml_string_data
  end

  alias yaml_string_data _memoize_yaml_string_data
end

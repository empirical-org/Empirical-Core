class CMS::Page
  attr_reader :name, :route, :options

  def initialize route, options
    @options = options.reverse_merge({
      editable: true
    })
    @name = route
    @route = (options[:route] || route).dup
  end

  def action
    @action ||= (options[:action] || route).dup
  end

  def editable?
    !options[:static]
  end
end

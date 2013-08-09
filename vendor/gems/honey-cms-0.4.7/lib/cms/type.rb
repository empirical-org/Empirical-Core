class CMS::Type
  attr_accessor :name, :attributes, :options, :references
  include ActiveModel::Naming # using include instead of extend on purpose
  def parents ; [] end # quacks like a Module

  def initialize name, attributes, options = {}
    @name = name
    @attributes = attributes
    @options = options.symbolize_keys.merge(timestamps: true, indexes: true, model: true)
    @options.merge!(@options.delete(:options).symbolize_keys) if @options[:options].present?
    @references = []
  end

  def accessible_attributes
    attributes
  end

  def attributes_with_index
    attributes.select { |a| a.has_index? || (a.reference? && options[:indexes]) }
  end

  def orderable_attributes
    attributes.select(&:orderable?)
  end

  def file_attributes
    attributes.select(&:file?)
  end

  def orderable?
    !!order_attribute
  end

  def order_attribute
    orderable_attributes.first
  end

  def order_options
    CMS::Template.inject_options(order_attribute.options)
  end

  def to_s
    name
  end

  def subject
    options[:subject] || name
  end
end

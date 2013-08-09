class CMS::Attribute
  attr_accessor :name, :format, :options

  def initialize name, format, options
    @name = name
    @format = format
    @options = options
    @attr_options = if self.format.boolean?
      {
        null: false,
        default: false
      }
    else
      {}
    end
  end

  def format
    @format_enquirer ||= ActiveSupport::StringInquirer.new(@format)
  end

  def reference? ; format.reference? end
  def orderable? ; format.orderable? end
  def file?      ; format.file? end

  def has_index?
    false
  end

  def has_uniq_index?
    false
  end

  def index_name
    format.reference? ? "#{name}_id" : name
  end

  def migration_type
    if format.reference?
      'belongs_to'
    elsif format.orderable?
      'integer'
    elsif format.file?
      'string'
    elsif format.html?
      'text'
    else
      format
    end
  end

  def form_type
    if format.orderable? || format.reference?
      'select'
    elsif format.text? or format.html?
      'text_area'
    elsif format.file?
      'file_field'
    elsif format.boolean?
      'check_box'
    else
      'text_field'
    end
  end

  def field_name
    if reference?
      name + '_id'
    else
      name
    end
  end

  def inject_options
    CMS::Template.inject_options(@attr_options)
  end

  def inject_index_options
    has_uniq_index? ? ", :unique => true" : ''
  end

  def reference_to
    if reference?
      @reference_to ||= CMS::Configuration.types.find{ |t| t.name == @options['reference_to'] }
    end
  end

  def to_s
    name
  end
end

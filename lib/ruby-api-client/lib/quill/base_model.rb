class Quill::BaseModel
  include ActiveModel::Model
  attr_accessor :id, :access_token

  def self.special_attrs *attrs
    return @special_attrs unless attrs.any?
    @special_attrs = attrs
  end

  def self.inherited subclass
    subclass.special_attrs *@special_attrs
  end

  def self.attributes *attrs
    return @attributes if defined?(@attributes)
    @attributes = attrs

    attrs.dup.unshift(*@special_attrs).each do |attr|
      class_eval <<-CODE
        def #{attr}
          @data[:#{attr}]
        end

        def #{attr}= value
          @data[:#{attr}] = value
        end
      CODE
    end
  end

  def initialize *args
    @data = {}
    super
    load_model_attributes
  end

  def save(options={})
    perform_validations(options) ? persist : false
  end

  def persist
    data = @data.except(*self.class.special_attrs.dup)
    serialized_data = {}

    data.each do |key, value|
      serialized_data[key] = value.to_yaml
    end

    params = { data: serialized_data }

    self.class.special_attrs.each do |attr|
      params[attr] = send(attr)
    end

    params = filter_params(params) if respond_to?(:filter_params)
    object = persist_params params
    self.id = object.uid if id.blank?
    true
  end

  def load_model_attributes
    return unless key_present?

    object = find
    object.data = {} if object.data.nil?
    attrs = {}

    self.id = object.uid

    # load attributes defined on the superclass. These attributes
    # are designated by Quill.
    self.class.special_attrs.each do |attr|
      attrs[attr] = object.send(attr)
    end

    # load user defined attributes. This is arbitrary data that the app
    # has stored for this record.
    self.class.attributes.each do |attr|
      begin
        if object.data[attr].to_s[0..2] == '---'
          attrs[attr] = YAML.load(object.data[attr])
        else
          attrs[attr] = object.data[attr]
        end
      rescue Psych::SyntaxError
        attrs[attr] = object.data[attr]
      end
    end

    @data.reverse_merge!(attrs)
  end

  def save!
    save || raise
  end

  def inspect
    %Q|#<#{self.class.name} #{@data.map{|k,v| "#{k}=#{v.inspect}"}.join(' ')}>|
  end

protected

  def key_present?
     id.present?
  end

  def persist_params params
    if id.present?
      api.activity_sessions.update(id, params)
    else
      api.activity_sessions.create(params)
    end
  end

  def api
    @api ||= Quill::Client.new(access_token: access_token)
  end

  def perform_validations(options={})
    options[:validate] == false || valid?(options[:context])
  end
end

class Quill::ActivityModel
  include ActiveModel::Model

  def self.attributes *attrs
    attrs.unshift(:_cid, :_uid)

    attrs.each do |attr|
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
    load_activity_attributes
  end

  def save(options={})
    perform_validations(options) ? persist : false
  end

  def persist
    return unless _cid.present? && _uid.present?

    api = Quill::API.new
    data = @data.except(:_uid, :_cid)

    if _uid.present?
      api.activities.update(_uid, data: data, cid: _cid)
    else
      api.activities.create(data: data, cid: _cid)
    end
  end

  def load_activity_attributes
    return unless _cid.present? && _uid.present?

    api = Quill::API.new

    activity = api.activities.find(_uid, cid: _cid)
    @data.reverse_merge!(activity.data.symbolize_keys)
  end

protected

  def perform_validations(options={})
    options[:validate] == false || valid?(options[:context])
  end
end

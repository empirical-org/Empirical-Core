# frozen_string_literal: true

class ApplicationSerializer < ActiveModel::Serializer
  def as_json(options = nil)
    if options&.key?(:root) && options[:root] == false
      super
    else
      serializable_resource.as_json
    end
  end

  private def options
    { serializer: self.class, adapter: :json }
  end

  private def serializable_resource
    return nil if object.nil?

    ActiveModelSerializers::SerializableResource.new(object, options)
  end
end

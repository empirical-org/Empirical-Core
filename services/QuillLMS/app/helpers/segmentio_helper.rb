# frozen_string_literal: true

module SegmentioHelper
  DEFAULT_DESTINATION_SETTINGS = {all: true}

  def generate_segment_identify_arguments(user)
    user_attributes = serialize_user(user)
    user_attributes = user_attributes.merge(intercom_properties(user))
    "#{user.id}, #{user_attributes.to_json}, #{destination_properties(user).to_json}"
  end

  def serialize_user(user)
    SegmentAnalyticsUserSerializer.new(user).render
  end

  def destination_properties(user)
    user_hash = OpenSSL::HMAC.hexdigest('sha256', ENV['INTERCOM_APP_SECRET'], user.id.to_s)
    DEFAULT_DESTINATION_SETTINGS.merge({Intercom: {user_hash: user_hash}})
  end

  def intercom_properties(user)
    {
      name: user.name,
      email: user.email,
    }
  end

  def format_analytics_properties(request, properties)
    common_properties = { path: request.fullpath,
                          referrer: request.referrer, }
    custom_properties = properties.map{ |k,v| ["custom_#{k}", v] }.to_h
    custom_properties.merge(common_properties)
  end
end

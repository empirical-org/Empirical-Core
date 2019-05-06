module SegmentioHelper
  def generate_segment_identify_arguments(current_user)
    "#{current_user.id}, #{serialize_user(current_user).to_json}, #{destination_properties(current_user)}"
  end

  def serialize_user(current_user)
    SegmentAnalyticsUserSerializer.new(current_user).render
  end

  def destination_properties(current_user)
    {
      all: true,
      Intercom: {
        user_hash: OpenSSL::HMAC.hexdigest('sha256', ENV['INTERCOM_APP_SECRET'], current_user.id.to_s),
      }
    }.to_json
  end

  def format_analytics_properties(request, properties)
    common_properties = { path: request.fullpath,
                          referrer: request.referrer, }
    custom_properties = properties.map{ |k,v| ["custom_" + k.to_s, v] }.to_h
    custom_properties.merge(common_properties)
  end
end

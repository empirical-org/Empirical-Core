module SegmentioHelper
  def generate_segment_identify_arguments (current_user)
    "#{current_user.id}, #{serialize_user(current_user).to_json}, #{destination_properties(current_user)}"
  end

  def serialize_user (current_user)
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
end

# frozen_string_literal: true

class SegmentAnalyticsUserSerializer < UserSerializer
  attributes :email, :created_at
  type :segment_analytics_user

  def render
    {
      userType: object.role,
      createdAt: object.created_at,
      daysSinceJoining: ((Time.current - object.created_at) / 60 / 60 / 24).to_i
    }
  end
end

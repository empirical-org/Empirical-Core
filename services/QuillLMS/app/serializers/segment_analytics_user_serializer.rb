# frozen_string_literal: true

class SegmentAnalyticsUserSerializer < UserSerializer
  attributes :email, :created_at

  def render
    {
      userType: object.role,
      createdAt: object.created_at,
      daysSinceJoining: ((Time.zone.now - object.created_at) / 60 / 60 / 24).to_i,
      premiumType: object.subscription&.account_type
    }
  end
end

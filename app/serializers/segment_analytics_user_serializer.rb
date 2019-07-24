class SegmentAnalyticsUserSerializer < UserSerializer
  attributes :email, :created_at

  def render
    {
      userType: self.object.role,
      createdAt: self.object.created_at,
      daysSinceJoining: ((Time.zone.now - self.object.created_at) / 60 / 60 / 24).to_i,
    }
  end
end

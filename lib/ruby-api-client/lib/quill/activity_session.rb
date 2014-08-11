class Quill::ActivitySession < Quill::BaseModel
  special_attrs :percentage, :time_spent, :state, :completed_at, :activity_uid, :anonymous

  def find
    if anonymous && id.blank?
      persist
    end

    api.activity_sessions.find(id)
  end

  def activity
    raise if activity_uid.blank?
    return nil if activity_uid.blank?
    return @activity if @activity.present?
    @activity = Story.new(id: activity_uid, access_token: access_token)
  end

  def key_present?
    return true if anonymous
    super
  end
end

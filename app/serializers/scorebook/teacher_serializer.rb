class Scorebook::TeacherSerializer < ActiveModel::Serializer
  attributes :premium_state

  def premium_state
    object.premium_state
  end

  def trial_days_remaining
    object.trial_days_remaining
  end
end

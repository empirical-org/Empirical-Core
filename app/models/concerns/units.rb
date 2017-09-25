module Units
  extend ActiveSupport::Concern

  def units_with_same_name_by_current_user(name, user_id)
    # units fix: do this in one sql hit passing user id
    User.find(user_id).units.where('lower(name) = ?', name.downcase)
  end

end

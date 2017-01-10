module Units
  extend ActiveSupport::Concern

  def units_with_same_name_by_current_user(name)
    current_user.units.where('lower(name) = ?', name.downcase)
  end

end

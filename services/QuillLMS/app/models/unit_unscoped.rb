# frozen_string_literal: true

# == Schema Information
#
# Table name: units
#
#  id               :integer          not null, primary key
#  name             :string(255)
#  open             :boolean          default(TRUE), not null
#  visible          :boolean          default(TRUE), not null
#  created_at       :datetime
#  updated_at       :datetime
#  unit_template_id :integer
#  user_id          :integer
#
# Indexes
#
#  index_units_on_unit_template_id  (unit_template_id)
#  index_units_on_user_id           (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (unit_template_id => unit_templates.id)
#
class UnitUnscoped < Unit
  self.default_scopes = []
end

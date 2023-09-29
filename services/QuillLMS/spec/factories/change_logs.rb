# frozen_string_literal: true

# == Schema Information
#
# Table name: change_logs
#
#  id                  :integer          not null, primary key
#  action              :string           not null
#  changed_attribute   :string
#  changed_record_type :string           not null
#  explanation         :text
#  new_value           :text
#  previous_value      :text
#  created_at          :datetime
#  updated_at          :datetime
#  changed_record_id   :integer
#  user_id             :integer
#
# Indexes
#
#  index_change_logs_on_changed_record_type_and_changed_record_id  (changed_record_type,changed_record_id)
#  index_change_logs_on_user_id                                    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :change_log do
    changed_record { create(:concept) }
    action { 'Renamed' }
    explanation { 'The first name was okay but this name is better.' }
    user { create(:user) }
  end
end

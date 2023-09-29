# frozen_string_literal: true

# == Schema Information
#
# Table name: user_activity_classifications
#
#  id                         :bigint           not null, primary key
#  count                      :integer          default(0)
#  activity_classification_id :bigint
#  user_id                    :bigint
#
# Indexes
#
#  index_user_activity_classifications_on_classifications  (activity_classification_id)
#  index_user_activity_classifications_on_user_id          (user_id)
#  user_activity_classification_unique_index               (user_id,activity_classification_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (activity_classification_id => activity_classifications.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :user_activity_classification do
    user { create(:user) }
    activity_classification { create(:activity_classification) }
    count { 0 }
  end
end


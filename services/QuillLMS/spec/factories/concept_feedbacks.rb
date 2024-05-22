# frozen_string_literal: true

# == Schema Information
#
# Table name: concept_feedbacks
#
#  id            :integer          not null, primary key
#  activity_type :string           not null
#  data          :jsonb
#  uid           :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_concept_feedbacks_on_activity_type          (activity_type)
#  index_concept_feedbacks_on_uid_and_activity_type  (uid,activity_type) UNIQUE
#
FactoryBot.define do
  data = {
    description: "<p>Put a describing phrase in the middle, right after the word it describes. Put a comma before and after the phrase.&nbsp;</p>",
    leftBox: "<p><u>You See</u></p><p>Rapheal was <strong>jumping with joy</strong>. </p><p>Raphael accepted the award.</p><br/><p><u>You See</u></p><p>Sarah smiled at her friend.</p><p>Sarah was <strong>surprised by the gift.</strong></p>",
    rightBox: "<p><u>You Write</u></p><p>Raphael<strong>, jumping with joy, </strong>accepted the award.</p><br/><p><u>You Write</u></p><p>Sarah<strong>, surprised by the gift, </strong>smiled at her friend.</p>"
  }

  factory :concept_feedback do
    uid { SecureRandom.uuid }
    activity_type { 'connect' }
    data { data }
  end
end

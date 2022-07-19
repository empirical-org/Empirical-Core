# frozen_string_literal: true

# == Schema Information
#
# Table name: raw_scores
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  order      :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class RawScore < ApplicationRecord
  validates :name, presence: true
  validates :order, presence: true

  SECOND_THROUGH_THIRD = "2nd-3rd"
  FOURTH_THROUGH_FIFTH = "4th-5th"
  SIXTH_THROUGH_SEVENTH = "6th-7th"
  EIGHTH_THROUGH_NINTH = "8th-9th"
  TENTH_THROUGH_TWELFTH = "10th-12th"

  def self.order_by_name
    RawScore.all.sort_by do |rs|
      if rs.name.include?('BR')
        [1, rs.name.match(/-.*/)[0].to_i]
      else
        [2, rs.name.split('-')[0].to_i]
      end
    end
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def readability_grade_level(activity_classification_id=nil)
    activity_classification = ActivityClassification.find_by_id(activity_classification_id)
    case name
    when "1200-1300"
      if ActivityClassification::EVIDENCE_KEY == activity_classification.key
        EIGHTH_THROUGH_NINTH
      else
        TENTH_THROUGH_TWELFTH
      end
    when "1300-1400", "1400-1500"
      TENTH_THROUGH_TWELFTH
    when "900-1000", "1000-1100", "1100-1200"
      EIGHTH_THROUGH_NINTH
    when "600-700", "700-800", "800-900"
      SIXTH_THROUGH_SEVENTH
    when "500-600"
      if [ActivityClassification::PROOFREADER_KEY, ActivityClassification::EVIDENCE_KEY].include?(activity_classification.key)
        FOURTH_THROUGH_FIFTH
      else
        SIXTH_THROUGH_SEVENTH
      end
    when "400-500"
      FOURTH_THROUGH_FIFTH
    when "300-400"
      if [ActivityClassification::PROOFREADER_KEY, ActivityClassification::EVIDENCE_KEY].include?(activity_classification.key)
        SECOND_THROUGH_THIRD
      else
        FOURTH_THROUGH_FIFTH
      end
    when "BR100-0", "0-100", "100-200", "200-300"
      SECOND_THROUGH_THIRD
    else
      ""
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity
end

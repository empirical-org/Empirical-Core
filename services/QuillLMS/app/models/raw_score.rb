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
        "8th-9th"
      else
        "10th-12th"
      end
    when "1300-1400", "1400-1500"
      "10th-12th"
    when "900-1000", "1000-1100", "1100-1200"
      "8th-9th"
    when "600-700", "700-800", "800-900"
      "6th-7th"
    when "500-600"
      if [ActivityClassification::PROOFREADER_KEY, ActivityClassification::EVIDENCE_KEY].include?(activity_classification.key)
        "4th-5th"
      else
        "6th-7th"
      end
    when "400-500"
      "4th-5th"
    when "300-400"
      if [ActivityClassification::PROOFREADER_KEY, ActivityClassification::EVIDENCE_KEY].include?(activity_classification.key)
        "2nd-3rd"
      else
        "4th-5th"
      end
    when "BR100-0", "0-100", "100-200", "200-300"
      "2nd-3rd"
    else
      ""
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity
end

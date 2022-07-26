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
  def readability_grade_level
    case name
    when "1200-1300", "1300-1400", "1400-1500"
      TENTH_THROUGH_TWELFTH
    when "1000-1100", "1100-1200"
      EIGHTH_THROUGH_NINTH
    when "800-900", "900-1000"
      SIXTH_THROUGH_SEVENTH
    when "500-600", "600-700", "700-800"
      FOURTH_THROUGH_FIFTH
    when "BR100-0", "0-100", "100-200", "200-300", "300-400", "400-500"
      SECOND_THROUGH_THIRD
    else
      ""
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity
end

class RawScore < ActiveRecord::Base
  validates :name, presence: true

  def readability_grade_level(activity_classification_id=nil)
    activity_classification = ActivityClassification.find_by_id(activity_classification_id)
    case name
    when "1200-1300", "1300-1400", "1400-1500"
      "10th-12th"
    when "900-1000", "1000-1100", "1100-1200"
      "8th-9th"
    when "500-600"
      if activity_classification.key == ActivityClassification::PROOFREADER_KEY
        "4th-5th"
      else
        "6th-7th"
      end
    when "600-700", "700-800", "800-900"
      "6th-7th"
    when "300-400", "400-500"
      "4th-5th"
    when "BR100-0", "0-100", "100-200", "200-300"
      "2nd-3rd"
    else
      ""
    end
  end
end

# == Schema Information
#
# Table name: previous_year_school_data
#
#  id         :bigint           not null, primary key
#  data       :jsonb
#  year       :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  school_id  :bigint           not null
#
# Indexes
#
#  index_previous_year_school_data_on_school_id  (school_id)
#
# Foreign Keys
#
#  fk_rails_...  (school_id => schools.id)
#
class PreviousYearSchoolDatum < ApplicationRecord
  belongs_to :school
  validates :year, presence: true
end

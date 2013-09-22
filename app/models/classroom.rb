class Classroom < ActiveRecord::Base
  has_many :classroom_chapters
  has_many :chapters, through: :classroom_chapters
  has_many :students, -> { where role: 'student' }, foreign_key: 'classcode', class_name: 'User', primary_key: 'code'
  belongs_to :teacher, class_name: 'User'

  before_validation :generate_code

private
  def generate_code
    self.code = NameGenerator.generate
  end
end

class Chapter < ActiveRecord::Base
   attr_accessible :title, :description, :workbook_id
   has_one :assessment
   has_many :lessons
   has_many :rules
   has_many :assignments
   belongs_to :workbook
end

class Chapter < ActiveRecord::Base
   attr_accessible :title, :description, :workbook_id, :assessment
   has_one :assessment
   has_many :assignments
   belongs_to :workbook
end

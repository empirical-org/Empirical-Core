class Chapter < ActiveRecord::Base
   attr_accessible :title, :workbook_id, :description
   has_one :assessment
   has_many :assignments
   belongs_to :workbook
   validates :title, presence: true
   validates :description, presence: true
end

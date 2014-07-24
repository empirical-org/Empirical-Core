# Workbooks are split up into sections, which consist of topics.
class Section < ActiveRecord::Base
  belongs_to :workbook
  has_many :topics
  include CMS::Orderable
  orderable :position
end

class ChapterLevel < ActiveRecord::Base
  has_many :chapters
  include CMS::Orderable
  orderable :position
end

class Assessment < ActiveRecord::Base
	attr_accessible :title, :body, :chapter_id
	belongs_to :chapter
end

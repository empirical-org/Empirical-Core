class BlogPost < ActiveRecord::Base
  belongs_to :author
  TOPICS = ['biking', 'cycling']




end

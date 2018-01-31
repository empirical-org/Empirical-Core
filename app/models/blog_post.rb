class BlogPost < ActiveRecord::Base
  belongs_to :author
  TOPICS = ['other', 'biking', 'cycling']




end

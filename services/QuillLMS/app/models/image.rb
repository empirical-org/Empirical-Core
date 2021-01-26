# == Schema Information
#
# Table name: images
#
#  id         :integer          not null, primary key
#  file       :string
#  created_at :datetime
#  updated_at :datetime
#
class Image < ActiveRecord::Base
  mount_uploader :file, FileUploader

end

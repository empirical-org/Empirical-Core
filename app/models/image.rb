class Image < ActiveRecord::Base
  mount_uploader :file, FileUploader

end

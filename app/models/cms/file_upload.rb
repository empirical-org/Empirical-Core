class CMS::FileUpload < ActiveRecord::Base
  self.table_name = 'file_uploads'
  attr_accessible :description, :file, :name
  mount_uploader :file, CMS::Uploader

  def self.name
    'FileUpload'
  end
end

# frozen_string_literal: true

class StaffCSVUploader < CarrierWave::Uploader::Base
  fog_directory 'quill-staff-file-uploads'
  storage :fog

  def store_dir
    "csv"
  end

  def extension_white_list
    %w(csv)
  end
end

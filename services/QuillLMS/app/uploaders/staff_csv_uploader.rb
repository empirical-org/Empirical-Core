# frozen_string_literal: true

class StaffCSVUploader < ApplicationUploader
  fog_directory 'quill-staff-file-uploads'

  def extension_white_list
    %w(csv)
  end

  def store_dir
    "csv"
  end
end

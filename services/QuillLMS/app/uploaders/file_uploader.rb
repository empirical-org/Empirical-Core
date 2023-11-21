# frozen_string_literal: true

class FileUploader < ApplicationUploader
  def store_dir
    "uploads/files"
  end
end

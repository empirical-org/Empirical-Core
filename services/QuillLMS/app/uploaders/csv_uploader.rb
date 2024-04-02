# frozen_string_literal: true

class CsvUploader < ApplicationUploader
  fog_authenticated_url_expiration 2.days.to_i
  fog_directory PROGRESS_REPORT_FOG_DIRECTORY

  def filename
    "Quill-Progress-Reports__#{date}__#{generate_token}.csv" if original_filename
  end

  def fog_public
    false
  end

  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/"
  end

  private def token_seed
    "#{Time.current.utc}--#{model.id}"
  end
end

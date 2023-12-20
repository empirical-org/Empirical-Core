# frozen_string_literal: true

class AdminUsageSnapshotReportPdfUploader < ApplicationUploader
  FILENAME_PREFIX = 'ADMIN_SNAPSHOT_REPORT_'

  fog_authenticated_url_expiration 7.days.to_i
  fog_directory ADMIN_REPORT_FOG_DIRECTORY

  attr_reader :user_id

  def initialize(user_id:)
    @user_id = user_id
    super(nil, nil)
  end

  def filename
    "#{FILENAME_PREFIX}_#{@user_id}_#{date}_#{generate_token}.pdf"
  end

  def fog_attributes
    { 'Content-Type' => 'application/pdf' }
  end

  def fog_public
    false
  end

  private def token_seed
    "#{Time.current.utc}--#{@user_id}"
  end
end

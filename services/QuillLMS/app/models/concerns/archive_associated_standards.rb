# frozen_string_literal: true

module ArchiveAssociatedStandards
  extend ActiveSupport::Concern

  included do
    before_save :archive_associated_standards_if_record_has_been_archived
  end

  def archive_associated_standards_if_record_has_been_archived
    return unless visible_changed?
    return if visible

    standards.each { |standard| standard.update(visible: false) }
  end
end

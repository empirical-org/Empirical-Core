module ArchiveAssociatedStandards
  extend ActiveSupport::Concern

  included do
    before_save :archive_associated_standards_if_record_has_been_archived
  end

  def archive_associated_standards_if_record_has_been_archived
    if visible_changed? && !visible
      standards.each do |standard|
        standard.update(visible: false)
      end
    end
  end
end

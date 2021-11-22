# frozen_string_literal: true

class ArchiveStandardLevels < ActiveRecord::Migration[4.2]

  TO_ARCHIVE = ["Diagnostic", "Quill Tutorial Lesson"]

  def change
    TO_ARCHIVE.each do |sl|
      begin
        standard_level = StandardLevel.find_by(:name=> sl)
        standard_level.visible = false
        standard_level.save!
        standard_level.standards.each do |s|
          s.activities.each do |a|
            a.update(standard: nil)
          end
        end
      rescue => e
        puts e
      end
    end
  end
end

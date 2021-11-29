# frozen_string_literal: true

module Archivable
  extend ActiveSupport::Concern

  def archived?
    !visible
  end

  def archive
    update(visible: false)
  end

  def unarchive
    update(visible: true)
  end

  class_methods do
    def archive_all
      update_all(visible: false)
    end
  end
end

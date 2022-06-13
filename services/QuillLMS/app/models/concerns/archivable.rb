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
end

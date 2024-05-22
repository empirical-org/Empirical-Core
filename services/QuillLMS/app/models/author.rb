# frozen_string_literal: true

# == Schema Information
#
# Table name: authors
#
#  id     :integer          not null, primary key
#  avatar :text
#  name   :string(255)
#
class Author < ApplicationRecord
  has_many :unit_templates
  after_commit :delete_relevant_caches

  DEFAULT_AVATAR_URL = 'https://assets.quill.org/images/authors/placeholder.png'

  def avatar_url
    avatar.blank? ? DEFAULT_AVATAR_URL : avatar
  end

  private def delete_relevant_caches
    UnitTemplate.delete_all_caches
  end
end

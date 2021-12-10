# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_healths
#
#  id                      :integer          not null, primary key
#  activity_categories     :string           is an Array
#  activity_packs          :jsonb
#  avg_common_unmatched    :float
#  avg_difficulty          :float
#  avg_mins_to_complete    :float
#  content_partners        :string           is an Array
#  diagnostics             :string           is an Array
#  flag                    :string
#  name                    :string
#  recent_plays            :integer
#  standard_dev_difficulty :float
#  tool                    :string
#  url                     :string
#
class ActivityHealth < ApplicationRecord
  ALLOWED_TOOLS = %w(connect grammar)
  FLAGS = %w(production archived alpha beta gamma private)

  has_many :prompt_healths

  validates :tool, inclusion: { in: ALLOWED_TOOLS, allow_nil: true}
  validates :flag, inclusion: { in: FLAGS, allow_nil: true}
  validates :recent_plays, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
  validates :avg_difficulty, inclusion: { in: 0..5, allow_nil: true }

  def serializable_hash(options = nil)
    options ||= {}

    super(options.reverse_merge(
      only: [:id, :name, :url, :activity_categories, :content_partners,
             :tool, :diagnostics, :avg_difficulty, :avg_common_unmatched,
             :standard_dev_difficulty, :recent_plays, :avg_mins_to_complete,
             :flag, :activity_packs],
      include: [:prompt_healths]
    ))
  end
end

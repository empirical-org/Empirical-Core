# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_classifications
#
#  id                :integer          not null, primary key
#  app_name          :string
#  form_url          :string
#  instructor_mode   :boolean          default(FALSE)
#  key               :string           not null
#  locked_by_default :boolean          default(FALSE)
#  module_url        :string
#  name              :string
#  order_number      :integer          default(999999999)
#  scored            :boolean          default(TRUE)
#  uid               :string           not null
#  created_at        :datetime
#  updated_at        :datetime
#
# Indexes
#
#  index_activity_classifications_on_uid  (uid) UNIQUE
#
class ActivityClassification < ApplicationRecord

  include Uid

  has_many :activities, dependent: :destroy
  has_many :old_concept_results
  has_many :user_activity_classifications, dependent: :destroy

  validates :key, presence: true

  DIAGNOSTIC_KEY = 'diagnostic'
  PROOFREADER_KEY = 'passage'
  LESSONS_KEY = 'lessons'
  EVIDENCE_KEY = 'evidence'
  CONNECT_KEY = 'connect'
  GRAMMAR_KEY = 'sentence'

  UNSCORED_KEYS = [
    DIAGNOSTIC_KEY,
    LESSONS_KEY,
    EVIDENCE_KEY
  ]

  scope :connect_or_grammar, -> {where(key: [CONNECT_KEY, GRAMMAR_KEY])}

  def self.unscored?(key)
    UNSCORED_KEYS.include?(key)
  end

  def self.diagnostic
    find_by_key DIAGNOSTIC_KEY
  end

  def self.evidence
    find_by_key EVIDENCE_KEY
  end

  def self.lessons
    find_by_key LESSONS_KEY
  end

  def self.proofreader
    find_by_key PROOFREADER_KEY
  end

  def self.grammar
    find_by_key GRAMMAR_KEY
  end

  def self.connect
    find_by_key CONNECT_KEY
  end

  def form_url
    HardcodedDomainRewriter.new(read_attribute(:form_url)).run
  end

  def module_url
    HardcodedDomainRewriter.new(read_attribute(:module_url)).run
  end
end

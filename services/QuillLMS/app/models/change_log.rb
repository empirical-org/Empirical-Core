# frozen_string_literal: true

# == Schema Information
#
# Table name: change_logs
#
#  id                  :integer          not null, primary key
#  action              :string           not null
#  changed_attribute   :string
#  changed_record_type :string           not null
#  explanation         :text
#  new_value           :text
#  previous_value      :text
#  created_at          :datetime
#  updated_at          :datetime
#  changed_record_id   :integer
#  user_id             :integer
#
# Indexes
#
#  index_change_logs_on_changed_record_type_and_changed_record_id  (changed_record_type,changed_record_id)
#  index_change_logs_on_user_id                                    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class ChangeLog < ApplicationRecord
  RENAMED = 'Renamed'
  UNARCHIVED = 'Unarchived'
  ARCHIVED = 'Archived'
  CREATED = 'Created'

  CONCEPT_ACTIONS = [
    RENAMED,
    'Level 2 updated',
    'Level 1 updated',
    UNARCHIVED,
    ARCHIVED,
    'Rule description updated',
    'Explanation updated',
    CREATED,
    'Replaced'
  ]
  TOPIC_ACTIONS = [
    RENAMED,
    'Level 3 updated',
    UNARCHIVED,
    ARCHIVED,
    CREATED
  ]
  STANDARD_ACTIONS = [
    ARCHIVED,
    UNARCHIVED,
    CREATED,
    'Standard category updated',
    'Standard level updated',
    RENAMED
  ]
  STANDARD_LEVEL_ACTIONS = [
    ARCHIVED,
    UNARCHIVED,
    CREATED,
    RENAMED
  ]
  STANDARD_CATEGORY_ACTIONS = [
    ARCHIVED,
    UNARCHIVED,
    CREATED,
    RENAMED
  ]
  EVIDENCE_ACTIONS = {
    create: 'created',
    delete: 'deleted',
    update: 'updated',
    activate_automl: 'activated'
  }
  CHANGED_RECORD_TYPES = [
    'Concept',
    'User',
    'Topic',
    'Standard',
    'StandardLevel',
    'StandardCategory',
    'Evidence::Activity',
    'Evidence::Prompt',
    'Evidence::Rule',
    'Evidence::Passage',
    'Evidence::AutomlModel',
    'Evidence::Label',
    'Evidence::Feedback',
    'Evidence::Highlight',
    'Evidence::RegexRule',
    'Evidence::PlagiarismText'
  ]
  USER_ACTIONS = {
    index: 'Visited User Directory',
    search: 'Searched Users',
    sign_in: 'Impersonated User',
    show: 'Visited User Admin Page',
    edit: 'Visited User Edit Page',
    update: 'Edited User',
    skipped_import: 'Skipped User import'
  }
  GENERIC_USER_ACTIONS = [
    'Visited User Directory',
    'Searched Users'
  ]
  ALL_ACTIONS = USER_ACTIONS.values + CONCEPT_ACTIONS + TOPIC_ACTIONS + STANDARD_ACTIONS + STANDARD_CATEGORY_ACTIONS + STANDARD_LEVEL_ACTIONS + EVIDENCE_ACTIONS.values

  belongs_to :changed_record, polymorphic: true
  belongs_to :user
  validates_presence_of :changed_record_type, :action

  validates :changed_record_id, presence: true, if: :needs_a_changed_record_id?
  validates :action, inclusion: ALL_ACTIONS
  validates :changed_record_type, inclusion: CHANGED_RECORD_TYPES

  def applies_to_single_record?
    [
      'Concept',
      'Topic',
      'Standard',
      'StandardLevel',
      'StandardCategory',
      'Evidence::Activity',
      'Evidence::Prompt',
      'Evidence::Rule',
      'Evidence::Passage',
      'Evidence::AutomlModel',
      'Evidence::Label',
      'Evidence::Feedback',
      'Evidence::Highlight',
      'Evidence::RegexRule',
      'Evidence::PlagiarismText'
    ].include?(changed_record_type) || !(GENERIC_USER_ACTIONS.include?(action))
  end

  def record_is_not_being_created_from_cms?
    # in the cms topics, standards, standard levels, and standard categories controllers, we use nested attributes to create change logs for the topic
    # on create, this causes the validation to fail because there isn't a changed_record_id yet - it gets added after the validations are run
    !(action == CREATED && ['Topic', 'Standard', 'StandardLevel', 'StandardCategory'].include?(changed_record_type))
  end

  def needs_a_changed_record_id?
    applies_to_single_record? && record_is_not_being_created_from_cms?
  end

  def serializable_hash(options = nil)
    options ||= {}

    super(options.reverse_merge(
      only: [:id, :action, :changed_attribute, :changed_record_type, :changed_record_id,
             :explanation, :new_value, :previous_value, :created_at, :updated_at, :user_id],
      methods: [:full_action, :changed_record_url, :changed_record_display_name, :conjunctions, :user, :updated_local_time]
    ))
  end

  def full_action
    "#{changed_record&.change_log_name} - #{action}" if changed_record.respond_to?(:change_log_name)
  end

  def changed_record_url
    changed_record&.url if changed_record.respond_to?(:url)
  end

  def changed_record_display_name
    changed_record&.evidence_name if changed_record.respond_to?(:evidence_name)
  end

  def conjunctions
    changed_record&.conjunctions if changed_record.respond_to?(:conjunctions)
  end

  def user
    User.find_by(id: user_id)&.name
  end

  def updated_local_time
    updated_at.localtime.to_s
  end
end

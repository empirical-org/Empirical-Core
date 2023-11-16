# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_activities
#
#  id                 :integer          not null, primary key
#  notes              :string
#  scored_level       :string(100)
#  target_level       :integer
#  title              :string(100)
#  version            :integer          default(1), not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  parent_activity_id :integer
#
# Indexes
#
#  index_comprehension_activities_on_parent_activity_id  (parent_activity_id)
#
module Evidence

  class Activity < ApplicationRecord
    self.table_name = 'comprehension_activities'

    include Evidence::ChangeLog
    MIN_TARGET_LEVEL = 1
    MAX_TARGET_LEVEL = 12
    MIN_TITLE_LENGTH = 5
    MAX_TITLE_LENGTH = 100
    MAX_SCORED_LEVEL_LENGTH = 100

    # See activity.rb in the enclosing app for the ur-constant,
    # which is not accessible from here
    LMS_ACTIVITY_DEFAULT_FLAG = 'alpha'
    FLAGS_ATTRIBUTE = 'flags'

    DEFAULT_BECAUSE_RULE_NAME = "Match with \"because of\" responses"
    DEFAULT_BECAUSE_RULE_CONCEPT = "6gQZPREURQQAaSzpIt_EEw"
    DEFAULT_BECAUSE_RULE_FEEDBACK = "Revise your work. Instead of starting your response with the word <i>of</i>, start with a person, place or thing."
    DEFAULT_BECAUSE_RULE_REGEX = "^of"

    DEFAULT_SO_RULE_NAME = "Match with \"so that\" responses"
    DEFAULT_SO_RULE_CONCEPT = "R3sBcYAvoXP2_oNVXiA98g"
    DEFAULT_SO_RULE_FEEDBACK = "Your response suggests a <i>so that</i> relationship, which explains a reason why something was done. Instead, use <i>so</i> to explain what happened as a result."
    DEFAULT_SO_RULE_REGEX = "^that(?!('s | is why))"
    DEFAULT_SO_RULE_HINT_ID = 657

    DEFAULT_REPEAT_STEM_RULE_NAME = "Repeating the stem"
    DEFAULT_REPEAT_STEM_RULE_CONCEPT = "N5VXCdTAs91gP46gATuvPQ"

    before_destroy :expire_turking_rounds
    before_validation :set_parent_activity, on: :create
    after_save :update_parent_activity_name, if: :saved_change_to_title?

    has_many :passages, inverse_of: :activity, dependent: :destroy
    has_many :prompts, inverse_of: :activity, dependent: :destroy
    has_many :turking_rounds, inverse_of: :activity
    has_many :rules, through: :prompts
    has_many :feedbacks, through: :rules
    has_many :highlights, through: :feedbacks

    belongs_to :parent_activity, class_name: Evidence.parent_activity_classname

    accepts_nested_attributes_for :passages, reject_if: proc { |p| p['text'].blank? }
    accepts_nested_attributes_for :prompts

    validates :parent_activity_id, uniqueness: {allow_nil: true}
    validates :target_level,
      numericality: {
        only_integer: true,
        less_than_or_equal_to: MAX_TARGET_LEVEL,
        greater_than_or_equal_to: MIN_TARGET_LEVEL,
        allow_nil: true
      }
    validates :title, presence: true, length: {in: MIN_TITLE_LENGTH..MAX_TITLE_LENGTH}
    validates :notes, presence: true
    validates :scored_level, length: { maximum: MAX_SCORED_LEVEL_LENGTH, allow_nil: true}
    validate :version_monotonically_increases, on: :update

    def set_parent_activity
      if parent_activity_id
        self.parent_activity = Evidence.parent_activity_class.find_by_id(parent_activity_id)
      else
        self.parent_activity = Evidence.parent_activity_class.find_or_create_by(
          name: title,
          activity_classification_id: Evidence.parent_activity_classification_class.evidence&.id
        ) do |parent_activity|
          parent_activity.flags = [LMS_ACTIVITY_DEFAULT_FLAG]
        end
      end
    end

    # match signature of method
    def serializable_hash(options = nil)
      options ||= {}
      super(options.reverse_merge(
        only: [:id, :parent_activity_id, :title, :version, :notes, :target_level, :scored_level],
        include: [:passages, :prompts],
        methods: [:invalid_highlights, :flag]
      ))
    end

    def change_log_name
      "Evidence Activity"
    end

    def url
      "evidence/#/activities/#{id}/settings"
    end

    private def update_parent_activity_name
      parent_activity&.update(name: title)
    end

    def flag
      parent_activity&.flag
    end

    def flag=flag
      set_parent_activity
      parent_activity.lms_user_id = @lms_user_id
      parent_activity.update(flag: flag)
    end

    def invalid_highlights
      invalid_feedback_highlights
    end

    def invalid_feedback_highlights
      invalid_highlights = highlights.select {|h| h.invalid_activity_ids&.include?(id)}
      invalid_highlights.map do |highlight|
        {
          rule_id: highlight.feedback.rule_id,
          rule_type: highlight.feedback.rule.rule_type,
          prompt_id: highlight.feedback.rule.prompts.where(activity_id: id).first.id
        }
      end
    end

    def last_flags_change_log_record
      change_logs.where(changed_attribute: FLAGS_ATTRIBUTE).last
    end

    # We use update_columns to avoid triggering callbacks, specifically,
    # ChangeLog's 'after_update: log_update'
    def increment_version!
      update_columns(version: version + 1)
    end

    def stem
      because_prompt&.text&.gsub(' because', '') || ""
    end

    def because_prompt
      prompts.find_by(conjunction: 'because')
    end

    def but_prompt
      prompts.find_by(conjunction: 'but')
    end

    def so_prompt
      prompts.find_by(conjunction: 'so')
    end

    def create_default_regex_rules
      create_default_because_rule
      create_default_so_rule
      create_default_repeat_stem_rule
    end

    def create_default_because_rule
      Evidence::Rule.create({
        name: DEFAULT_BECAUSE_RULE_NAME,
        universal: false,
        concept_uid: DEFAULT_BECAUSE_RULE_CONCEPT,
        optimal: false,
        rule_type: Evidence::Rule::TYPE_REGEX_ONE,
        suborder: 0,
        state: Evidence::Rule::STATE_ACTIVE,
        feedbacks_attributes: [
          {
            text: DEFAULT_BECAUSE_RULE_FEEDBACK,
            order: 0
          }
        ],
        regex_rules_attributes: [
          {
            regex_text: DEFAULT_BECAUSE_RULE_REGEX,
            sequence_type: Evidence::RegexRule::TYPE_INCORRECT,
            case_sensitive: false
          }
        ],
        prompt_ids: [because_prompt&.id]
      })
    end

    def create_default_so_rule
      Evidence::Rule.create({
        name: DEFAULT_SO_RULE_NAME,
        universal: false,
        concept_uid: DEFAULT_SO_RULE_CONCEPT,
        optimal: false,
        rule_type: Evidence::Rule::TYPE_REGEX_ONE,
        suborder: 1,
        state: Evidence::Rule::STATE_ACTIVE,
        feedbacks_attributes: [
          {
            text: DEFAULT_SO_RULE_FEEDBACK,
            order: 0
          }
        ],
        regex_rules_attributes: [
          {
            regex_text: DEFAULT_SO_RULE_REGEX,
            sequence_type: Evidence::RegexRule::TYPE_INCORRECT,
            case_sensitive: false
          }
        ],
        hint_id: DEFAULT_SO_RULE_HINT_ID,
        prompt_ids: [so_prompt&.id]
      })
    end

    def create_default_repeat_stem_rule
      Evidence::Rule.create({
        name: DEFAULT_REPEAT_STEM_RULE_NAME,
        universal: false,
        concept_uid: DEFAULT_REPEAT_STEM_RULE_CONCEPT,
        optimal: false,
        rule_type: Evidence::Rule::TYPE_REGEX_ONE,
        suborder: 2,
        state: Evidence::Rule::STATE_ACTIVE,
        feedbacks_attributes: [
          {
            text: "Revise your work. You don't need to repeat \"#{stem}\" before writing your response.",
            order: 0
          }
        ],
        regex_rules_attributes: [
          {
            regex_text: "^#{stem}",
            sequence_type: Evidence::RegexRule::TYPE_INCORRECT,
            case_sensitive: false
          }
        ],
        prompt_ids: [because_prompt&.id, but_prompt&.id, so_prompt&.id]
      })
    end

    private def expire_turking_rounds
      turking_rounds.each(&:expire!)
    end

    private def version_monotonically_increases
      current_persisted_version = self.class.find(id).version
      return if version == current_persisted_version + 1
      return if version == current_persisted_version

      errors.add(:version, 'does not monotonically increase.')
    end
  end
end

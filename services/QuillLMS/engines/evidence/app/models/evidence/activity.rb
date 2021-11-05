module Evidence

  class Activity < ApplicationRecord
    self.table_name = 'comprehension_activities'

    include Evidence::ChangeLog
    MIN_TARGET_LEVEL = 1
    MAX_TARGET_LEVEL = 12
    MIN_TITLE_LENGTH = 5
    MAX_TITLE_LENGTH = 100
    MAX_SCORED_LEVEL_LENGTH = 100

    before_destroy :expire_turking_rounds
    before_validation :set_parent_activity, on: :create
    after_save :update_parent_activity_name, if: :saved_change_to_title?

    has_many :passages, inverse_of: :activity, dependent: :destroy
    has_many :prompts, inverse_of: :activity, dependent: :destroy
    has_many :turking_rounds, inverse_of: :activity
    belongs_to :parent_activity, class_name: Evidence.parent_activity_classname

    accepts_nested_attributes_for :passages, reject_if: proc { |p| p['text'].blank? }
    accepts_nested_attributes_for :prompts

    validates :parent_activity_id, uniqueness: {allow_nil: true}
    validates :target_level, presence: true,
      numericality: {
        only_integer: true,
        less_than_or_equal_to: MAX_TARGET_LEVEL,
        greater_than_or_equal_to: MIN_TARGET_LEVEL
      }
    validates :title, presence: true, length: {in: MIN_TITLE_LENGTH..MAX_TITLE_LENGTH}
    validates :notes, presence: true
    validates :scored_level, length: { maximum: MAX_SCORED_LEVEL_LENGTH, allow_nil: true}

    def set_parent_activity
      if parent_activity_id
        self.parent_activity = Evidence.parent_activity_class.find_by_id(parent_activity_id)
      else
        self.parent_activity = Evidence.parent_activity_class.find_or_create_by(
          name: title,
          activity_classification_id: Evidence.parent_activity_classification_class.evidence&.id
        )
      end
    end

    # match signature of method
    def serializable_hash(options = nil)
      options ||= {}
      super(options.reverse_merge(
        only: [:id, :parent_activity_id, :title, :notes, :target_level, :scored_level],
        include: [:passages, :prompts],
        methods: [:invalid_highlights]
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

    def invalid_highlights
      invalid_feedback_highlights
    end

    def invalid_feedback_highlights
      related_higlights = prompts.map(&:rules).flatten.map(&:feedbacks).flatten.map(&:highlights).flatten
      invalid_highlights = related_higlights.select {|h| h.invalid_activity_ids&.include?(id)}
      invalid_highlights.map do |highlight|
        {
          rule_id: highlight.feedback.rule_id,
          rule_type: highlight.feedback.rule.rule_type,
          prompt_id: highlight.feedback.rule.prompts.where(activity_id: id).first.id 
        }
      end
    end

    private def expire_turking_rounds
      turking_rounds.each(&:expire!)
    end
  end
end

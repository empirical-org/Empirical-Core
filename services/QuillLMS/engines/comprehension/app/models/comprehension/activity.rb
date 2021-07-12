module Comprehension

  class Activity < ActiveRecord::Base
    include Comprehension::ChangeLog

    MIN_TARGET_LEVEL = 1
    MAX_TARGET_LEVEL = 12
    MIN_TITLE_LENGTH = 5
    MAX_TITLE_LENGTH = 100
    MAX_SCORED_LEVEL_LENGTH = 100

    attr_accessor :lms_user_id

    before_destroy :expire_turking_rounds
    before_validation :set_parent_activity, on: :create
    after_save :log_creation
    after_destroy :log_deletion

    has_many :passages, inverse_of: :activity, dependent: :destroy
    has_many :prompts, inverse_of: :activity, dependent: :destroy
    has_many :turking_rounds, inverse_of: :activity
    has_many :change_logs
    belongs_to :parent_activity, class_name: Comprehension.parent_activity_class

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

    CHANGE_LOG_DISPLAY_NAMES = {
      "Comprehension::Prompt": "Prompt",
      "Comprehension::Activity": "Activity",
      "Comprehension::Rule": "Universal"
    }

    def save_with_session_user(user_id)
      @lms_user_id = user_id
      save
    end

    def destroy_with_session_user(user_id)
      @lms_user_id = user_id
      destroy
    end

    def set_parent_activity
      if parent_activity_id
        self.parent_activity = Comprehension.parent_activity_class.find_by_id(parent_activity_id)
      else
        self.parent_activity = Comprehension.parent_activity_class.find_or_create_by(
          name: title,
          activity_classification_id: Comprehension.parent_activity_classification_class.comprehension&.id
        )
      end
    end

    # match signature of method
    def serializable_hash(options = nil)
      options ||= {}
      super(options.reverse_merge(
        only: [:id, :parent_activity_id, :title, :notes, :target_level, :scored_level],
        include: [:passages, :prompts]
      ))
    end

    def change_logs
      change_logs = []
      change_logs.push(Comprehension.change_log_class.where(changed_record_type: 'Comprehension::Activity', changed_record_id: id))
      prompts.each do |p|
        change_logs.push(Comprehension.change_log_class.where(changed_record_type: 'Comprehension::Prompt', changed_record_id: p.id))
      end
      change_logs.push(Comprehension.change_log_class.where(changed_record_type: 'Comprehension::Rule'))
      change_logs.flatten!
      change_logs.map do |cl|
        cl.attributes.merge(
          {
          "user": User.find(cl["user_id"]).name,
          "record_type_display_name": CHANGE_LOG_DISPLAY_NAMES[cl["changed_record_type"].to_sym],
          "updated_local_time": cl["updated_at"].localtime.to_s
          })
      end
    end

    private def expire_turking_rounds
      turking_rounds.each(&:expire!)
    end

    def url
      "comprehension/#/activities/#{id}/settings"
    end

    def log_creation
      return unless @lms_user_id.present?
      log_change(@lms_user_id, :create_activity, self, {url: url}.to_json, nil, nil, nil)
    end

    def log_deletion
      return unless @lms_user_id.present?
      log_change(@lms_user_id, :delete_activity, self, {url: url}.to_json, nil, nil, nil)
    end
  end
end

# frozen_string_literal: true

# == Schema Information
#
# Table name: activities
#
#  id                         :integer          not null, primary key
#  data                       :jsonb
#  description                :text
#  flags                      :string           default([]), not null, is an Array
#  maximum_grade_level        :integer
#  minimum_grade_level        :integer
#  name                       :string
#  repeatable                 :boolean          default(TRUE)
#  supporting_info            :string
#  uid                        :string           not null
#  created_at                 :datetime
#  updated_at                 :datetime
#  activity_classification_id :integer
#  follow_up_activity_id      :integer
#  raw_score_id               :integer
#  standard_id                :integer
#  topic_id                   :integer
#
# Indexes
#
#  index_activities_on_activity_classification_id  (activity_classification_id)
#  index_activities_on_raw_score_id                (raw_score_id)
#  index_activities_on_topic_id                    (topic_id)
#  index_activities_on_uid                         (uid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (raw_score_id => raw_scores.id)
#  fk_rails_...  (standard_id => standards.id)
#
class Activity < ApplicationRecord
  include Flags
  include Uid

  validate :data_must_be_hash

  has_and_belongs_to_many :unit_templates

  belongs_to :classification, class_name: 'ActivityClassification', foreign_key: 'activity_classification_id'
  belongs_to :standard
  belongs_to :raw_score
  belongs_to :follow_up_activity, class_name: "Activity", foreign_key: "follow_up_activity_id"

  has_one :standard_level, through: :standard

  has_many :skill_group_activities
  has_many :skill_groups, through: :skill_group_activities
  has_many :skills, through: :skill_groups
  has_many :unit_activities, dependent: :destroy
  has_many :units, through: :unit_activities
  has_many :classroom_units, through: :units
  has_many :classrooms, through: :classroom_units
  has_many :pack_sequence_items, through: :classroom_units
  has_many :user_pack_sequence_items, through: :pack_sequence_items
  has_many :recommendations, dependent: :destroy
  has_many :activity_category_activities, dependent: :destroy
  has_many :activity_categories, through: :activity_category_activities
  has_many :content_partner_activities, dependent: :destroy
  has_many :content_partners, :through => :content_partner_activities
  has_many :teacher_saved_activities, dependent: :destroy
  has_many :teachers, through: :teacher_saved_activities, foreign_key: 'teacher_id'
  has_many :activity_topics, dependent: :destroy
  has_many :topics, through: :activity_topics

  before_create :flag_as_beta, unless: :flags?
  before_save :set_minimum_and_maximum_grade_levels_to_default_values, unless: :minimum_grade_level
  after_commit :clear_activity_search_cache
  after_save :update_evidence_child_title, if: :update_evidence_title?
  after_save :log_evidence_flag_change, if: :update_evidence_flags?

  attr_accessor :lms_user_id

  delegate :form_url, to: :classification, prefix: true

  validates :minimum_grade_level, numericality: { greater_than_or_equal_to: 4, less_than_or_equal_to: 12, allow_nil: true }
  validates :maximum_grade_level, numericality: { greater_than_or_equal_to: 4, less_than_or_equal_to: 12, allow_nil: true }

  scope :production, lambda {
    where(<<-SQL, :production)
      activities.flags = '{}' OR ? = ANY (activities.flags)
    SQL
  }

  PRODUCTION = 'production'
  GAMMA = 'gamma'
  BETA = 'beta'
  ALPHA = 'alpha'
  ARCHIVED = 'archived'

  scope :gamma_user, -> { where("'#{GAMMA}' = ANY(activities.flags) OR '#{BETA}' = ANY(activities.flags) OR '#{PRODUCTION}' = ANY(activities.flags)")}
  scope :beta_user, -> { where("'#{BETA}' = ANY(activities.flags) OR '#{PRODUCTION}' = ANY(activities.flags)")}
  scope :alpha_user, -> { where("'#{ALPHA}' = ANY(activities.flags) OR '#{BETA}' = ANY(activities.flags) OR '#{GAMMA}' = ANY(activities.flags) OR '#{PRODUCTION}' = ANY(activities.flags)")}

  scope :with_classification, -> { includes(:classification).joins(:classification) }

  # only Grammar (2), Connect (5), and Diagnostic (4) Activities contain questions
  # the other two, Proofreader and Lesson, contain passages and other data, not questions
  ACTIVITY_TYPES_WITH_QUESTIONS = [2,4,5]

  STARTER_DIAGNOSTIC_ACTIVITY_ID = 1663
  INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID = 1668
  ADVANCED_DIAGNOSTIC_ACTIVITY_ID = 1678
  ELL_STARTER_DIAGNOSTIC_ACTIVITY_ID = 1161
  ELL_INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID = 1568
  ELL_ADVANCED_DIAGNOSTIC_ACTIVITY_ID = 1590
  PRE_TEST_DIAGNOSTIC_IDS = [STARTER_DIAGNOSTIC_ACTIVITY_ID, INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID, ADVANCED_DIAGNOSTIC_ACTIVITY_ID, ELL_STARTER_DIAGNOSTIC_ACTIVITY_ID, ELL_INTERMEDIATE_DIAGNOSTIC_ACTIVITY_ID, ELL_ADVANCED_DIAGNOSTIC_ACTIVITY_ID]

  READABILITY_GRADE_LEVEL_TO_MINIMUM_GRADE_LEVEL = {
    RawScore::SECOND_THROUGH_THIRD => 4,
    RawScore::FOURTH_THROUGH_FIFTH => 4,
    RawScore::SIXTH_THROUGH_SEVENTH => 6,
    RawScore::EIGHTH_THROUGH_NINTH => 8,
    RawScore::TENTH_THROUGH_TWELFTH => 10
  }

  DEFAULT_MAX_GRADE_LEVEL = 12

  def self.diagnostic_activity_ids
    ActivityClassification.find_by_key('diagnostic')&.activities&.pluck(:id) || []
  end

  def self.activity_with_recommendations_ids
    Rails.cache.fetch('all_recommendation_activity_ids', expires_in: 24.hours) do
      Recommendation.all.map(&:activity_id).uniq
    end
  end

  def self.find_by_id_or_uid(arg)
    find_by(uid: arg)  || find(arg)
  end

  def standard_uid= uid
    self.standard_id = Standard.find_by_uid(uid).id
  end

  def activity_classification_uid= uid
    self.activity_classification_id = ActivityClassification.find_by(uid: uid).id
  end

  def self.user_scope(user_flag)
    case user_flag
    when ALPHA
      Activity.alpha_user
    when BETA
      Activity.beta_user
    when GAMMA
      Activity.gamma_user
    else
      Activity.production
    end
  end

  def classification_key= key
    self.classification = ActivityClassification.find_by_key(key)
  end

  def classification_key
    classification.try(:key)
  end

  def form_url
    url = Addressable::URI.parse(classification.form_url)

    if uid.present?
      params = (url.query_values || {})
      params[:uid] = uid
      url.query_values = params
    end

    url
  end

  def module_url(activity_session)
    @activity_session = activity_session
    classification_count = @activity_session&.user_activity_classifications&.find_by(user_id: @activity_session.user_id)&.count
    initial_params = {student: activity_session.uid}
    initial_params[:activities] = classification_count if classification_count
    module_url_helper(initial_params)
  end

  def anonymous_module_url
    initial_params = {anonymous: true}
    module_url_helper(initial_params)
  end

  # TODO: cleanup
  def flag(flag = nil)
    return super(flag) unless flag.nil?

    flags.first
  end

  def flag=(flag)
    self.flags = [flag]
  end

  def clear_activity_search_cache
    # can't call class methods from callback
    self.class.clear_activity_search_cache
  end

  def self.clear_activity_search_cache
    User::FLAGSETS.keys.map{|x| "#{x}_"}.push("").each do |flagset|
      $redis.del("default_#{flagset}activity_search")
    end
  end

  def self.set_activity_search_cache
    $redis.set('default_activity_search', ActivitySearchWrapper.new('production').search.to_json)
  end

  def lesson?
    activity_classification_id == 6
  end

  def uses_feedback_history?
    is_evidence?
  end

  def self.search_results(flagset)
    substring = flagset ? "#{flagset}_" : ""
    activity_search_results = $redis.get("default_#{substring}activity_search")
    activity_search_results ||= ActivitySearchWrapper.search_cache_data(flagset)
    JSON.parse(activity_search_results)
  end

  def data_as_json
    data
  end

  def add_question(question)
    return if !validate_question(question)

    if !ACTIVITY_TYPES_WITH_QUESTIONS.include?(activity_classification_id)
      errors.add(:activity, "You can't add questions to this type of activity.")
      return
    end
    data['questions'] ||= []
    data['questions'].push(question)
    save
  end

  def readability_grade_level
    raw_score&.readability_grade_level
  end

  def default_minimum_grade_level
    return nil if readability_grade_level.nil?

    READABILITY_GRADE_LEVEL_TO_MINIMUM_GRADE_LEVEL[readability_grade_level]
  end

  def default_maximum_grade_level
    return nil if readability_grade_level.nil?

    DEFAULT_MAX_GRADE_LEVEL
  end

  def set_minimum_and_maximum_grade_levels_to_default_values
    self.minimum_grade_level = default_minimum_grade_level
    self.maximum_grade_level = default_minimum_grade_level ? default_maximum_grade_level : nil
  end

  def is_diagnostic?
    classification&.key == ActivityClassification::DIAGNOSTIC_KEY
  end

  def is_proofreader?
    classification.key == ActivityClassification::PROOFREADER_KEY
  end

  def is_evidence?
    classification&.key == ActivityClassification::EVIDENCE_KEY
  end

  def child_activity
    return unless is_evidence?

    Evidence::Activity.find_by(parent_activity_id: id)
  end

  def segment_activity
    SegmentIntegration::Activity.new(self)
  end

  def locked_user_pack_sequence_item?(user)
    user_pack_sequence_items.locked.exists?(user: user)
  end

  private def update_evidence_title?
    is_evidence? && saved_change_to_name?
  end

  private def update_evidence_flags?
    is_evidence? && saved_change_to_flags? && child_activity
  end

  private def update_evidence_child_title
    child_activity&.update(title: name)
  end

  private def log_evidence_flag_change
    change_log = {
      user_id: @lms_user_id,
      action: ChangeLog::EVIDENCE_ACTIONS[:update],
      changed_record_type: 'Evidence::Activity',
      changed_record_id: child_activity&.id,
      explanation: nil,
      changed_attribute: "flags",
      previous_value: previous_changes["flags"][0],
      new_value: previous_changes["flags"][1]
    }
    ChangeLog.create(change_log)
  end

  private def data_must_be_hash
    errors.add(:data, "must be a hash") unless data.is_a?(Hash) || data.blank?
  end

  private def flag_as_beta
    flag 'beta'
  end

  private def lesson_url_helper
    base_url = "#{classification.module_url}#{uid}"
    initial_params = {
      classroom_unit_id: @activity_session.classroom_unit.id.to_s,
      student: @activity_session.uid
    }
    construct_redirect_url(base_url, initial_params)
  end

  private def connect_url_helper(initial_params)
    base_url = "#{classification.module_url}#{uid}"
    construct_redirect_url(base_url, initial_params)
  end

  private def evidence_url_helper(initial_params)
    base_url = classification.module_url.to_s
    # Rename "student" to "session" because it's called "student" in all tools other than Evidence
    initial_params[:session] = initial_params.delete :student if initial_params[:student]
    initial_params[:uid] = Evidence::Activity.find_by(parent_activity_id: id).id
    initial_params[:skipToPrompts] = true if initial_params[:anonymous]
    construct_redirect_url(base_url, initial_params)
  end

  private def construct_redirect_url(base_url, initial_params)
    @url = Addressable::URI.parse(base_url)
    params = (@url.query_values || {})
    params.merge!(initial_params)
    @url.query_values = params
    fix_angular_fragment!
  end

  private def module_url_helper(initial_params)
    return connect_url_helper(initial_params) if [ActivityClassification::DIAGNOSTIC_KEY, ActivityClassification::CONNECT_KEY].include?(classification.key)
    return lesson_url_helper if classification.key == ActivityClassification::LESSONS_KEY
    return evidence_url_helper(initial_params) if classification.key == ActivityClassification::EVIDENCE_KEY

    @url = Addressable::URI.parse(classification.module_url)
    params = (@url.query_values || {})
    params.merge!(initial_params)
    params[:uid] = uid if uid.present?
    @url.query_values = params
    fix_angular_fragment!
  end

  private def fix_angular_fragment!
    unless @url.fragment.blank?
      path = @url.path || '/'
      @url.path = "#{@url.path}##{@url.fragment}"
      @url.fragment = nil
    end

    @url
  end

  private def validate_question(question)
    if Question.find_by_uid(question[:key]).blank? && TitleCard.find_by_uid(question[:key]).blank?
      errors.add(:question, "Question #{question[:key]} does not exist.")
      return false
    end
    if data["questionType"] != question[:questionType]
      errors.add(:question, "The question type #{question[:questionType]} does not match the lesson's question type: #{data['questionType']}")
      return false
    end
    return true
  end
end

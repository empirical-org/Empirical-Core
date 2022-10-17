# frozen_string_literal: true

# == Schema Information
#
# Table name: activity_sessions
#
#  id                    :integer          not null, primary key
#  completed_at          :datetime
#  data                  :jsonb
#  is_final_score        :boolean          default(FALSE)
#  is_retry              :boolean          default(FALSE)
#  percentage            :float
#  started_at            :datetime
#  state                 :string           default("unstarted"), not null
#  temporary             :boolean          default(FALSE)
#  timespent             :integer
#  uid                   :string
#  visible               :boolean          default(TRUE), not null
#  created_at            :datetime
#  updated_at            :datetime
#  activity_id           :integer
#  classroom_activity_id :integer
#  classroom_unit_id     :integer
#  pairing_id            :string
#  user_id               :integer
#
# Indexes
#
#  index_activity_sessions_on_activity_id            (activity_id)
#  index_activity_sessions_on_classroom_activity_id  (classroom_activity_id)
#  index_activity_sessions_on_classroom_unit_id      (classroom_unit_id)
#  index_activity_sessions_on_completed_at           (completed_at)
#  index_activity_sessions_on_pairing_id             (pairing_id)
#  index_activity_sessions_on_started_at             (started_at)
#  index_activity_sessions_on_state                  (state)
#  index_activity_sessions_on_uid                    (uid) UNIQUE
#  index_activity_sessions_on_user_id                (user_id)
#
require 'newrelic_rpm'
require 'new_relic/agent'

class ActivitySession < ApplicationRecord

  class ConceptResultSubmittedWithoutActivitySessionError < StandardError; end
  class StudentNotAssignedActivityError < StandardError; end
  class LongTimeTrackingError < StandardError; end

  include Uid
  include Concepts

  STATE_UNSTARTED = 'unstarted'
  STATE_STARTED = 'started'
  STATE_FINISHED = 'finished'

  STATE_FINISHED_KEY = 'finished'

  TIME_TRACKING_KEY = 'time_tracking'
  TIME_TRACKING_EDITS_KEY = 'time_tracking_edits'

  MAX_4_BYTE_INTEGER_SIZE = 2147483647

  default_scope { where(visible: true)}
  has_many :feedback_sessions, foreign_key: :activity_session_uid, primary_key: :uid
  has_many :feedback_histories, through: :feedback_sessions
  belongs_to :classroom_unit, touch: true
  belongs_to :activity
  has_one :classification, through: :activity
  has_many :user_activity_classifications, through: :classification
  has_one :classroom, through: :classroom_unit
  has_one :unit, through: :classroom_unit
  has_many :concept_results
  has_many :teachers, through: :classroom
  has_many :concepts, -> { distinct }, through: :concept_results
  has_one :active_activity_session, foreign_key: :uid, primary_key: :uid
  has_one :activity_survey_response

  validate :correctly_assigned, :on => :create


  # ownable :user
  belongs_to :user

  before_create :set_state
  before_save   :set_completed_at, :set_activity_id

  after_save    :determine_if_final_score, :update_milestones, :increment_counts
  after_save :record_teacher_activity_feed, if: [:saved_change_to_completed_at?, :completed?]

  after_commit :invalidate_activity_session_count_if_completed

  around_save   :trigger_events

  # FIXME: do we need the below? if we omit it, may make things faster
  default_scope -> { joins(:activity) }

  scope :completed,  -> { where.not(completed_at: nil) }
  scope :incomplete, -> { where(completed_at: nil, is_retry: false) }
  # this is a default scope, adding this for unscoped use.
  scope :visible,  -> { where(visible: true) }

  scope :for_teacher, lambda { |teacher_id|
    joins(classroom_unit: {classroom: :teachers})
    .where(users: { id: teacher_id})
  }
  scope :averages_for_user_ids, lambda {|user_ids|
    select('user_id, AVG(percentage) as avg')
    .joins(activity: :classification)
    .where.not(activity_classifications: {key: ActivityClassification::UNSCORED_KEYS})
    .where(user_id: user_ids)
    .group(:user_id)
  }

  # scope :started_or_better, -> { where("state != 'unstarted'") }
  #
  # scope :current_session, -> {
  #   complete_session   = completed.first
  #   incomplete_session = incomplete.first
  #   (complete_session || incomplete_session)
  # }

  RESULTS_PER_PAGE = 25

  CONCEPT_UIDS_TO_EXCLUDE_FROM_REPORT = [
    'JVJhNIHGZLbHF6LYw605XA',
    'H-2lrblngQAQ8_s-ctye4g',
    '5E8cleeh-dUUFncVhLy9AQ',
    'jaUtRoHeqvvNhiEBOhjvhg'
  ]

  PROFICIENT = 'Proficient'
  NEARLY_PROFICIENT = 'Nearly proficient'
  NOT_YET_PROFICIENT = 'Not yet proficient'
  COMPLETED = 'Completed'
  FINISHED_STATE = 'finished'

  def self.paginate(current_page, per_page)
    offset = (current_page.to_i - 1) * per_page
    limit(per_page).offset(offset)
  end

  def self.with_best_scores
    where(is_final_score: true)
  end

  # returns {user_id: average}
  def self.average_scores_by_student(user_ids)
    averages_for_user_ids(user_ids)
    .map{|as| [as['user_id'], (as['avg'].to_f * 100).to_i]}
    .to_h
  end

  def timespent
    if read_attribute(:timespent).present?
      read_attribute(:timespent)
    elsif data.nil?
      nil
    else
      self.class.time_tracking_sum(data['time_tracking'])
    end
  end

  def started?
    state == STATE_STARTED
  end

  def finished?
    state == FINISHED_STATE
  end

  def self.time_tracking_sum(time_tracking)
    return nil unless time_tracking.respond_to?(:values)

    time_tracking.values.compact.sum
  end

  def self.calculate_timespent(activity_session, time_tracking)
    timespent = activity_session&.timespent || time_tracking_sum(time_tracking)

    return nil if timespent.nil?

    [timespent, MAX_4_BYTE_INTEGER_SIZE].min
  end

  def eligible_for_tracking?
    classroom_unit.present? && classroom_unit.classroom.present? && classroom_unit.classroom.owner.present?
  end

  def classroom_owner
    classroom_unit.classroom.owner
  end

  def self.by_teacher(teacher)
    joins(
      " JOIN classroom_units cu ON activity_sessions.classroom_unit_id = cu.id
        JOIN classrooms_teachers ON cu.classroom_id = classrooms_teachers.classroom_id
        JOIN classrooms ON cu.classroom_id = classrooms.id
      "
    ).where("classrooms_teachers.user_id = ?", teacher.id)
  end

  def self.with_filters(query, filters)
    if filters[:classroom_id].present?
      query = query.where("classrooms.id = ?", filters[:classroom_id])
    end

    if filters[:student_id].present?
      query = query.where("activity_sessions.user_id = ?", filters[:student_id])
    end

    if filters[:unit_id].present?
      query = query.joins(:classroom_unit).where("classroom_units.unit_id = ?", filters[:unit_id])
    end

    if filters[:standard_level_id].present?
      query = query.joins(activity: :standard).where('standards.standard_level_id IN (?)', filters[:standard_level_id])
    end

    if filters[:standard_id].present?
      query = query.joins(:activity).where('activities.standard_id IN (?)', filters[:standard_id])
    end

    query
  end

  def unit
    classroom_unit&.unit
  end

  def unit_activity
    if activity_id
      UnitActivity.find_by(unit: unit, activity_id: activity_id)
    else
      unit&.unit_activities&.length == 1 ? unit&.unit_activities&.first : nil
    end
  end

  def activity
    super || unit_activity&.activity
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def determine_if_final_score
    return if state != 'finished' || (percentage.nil? && !activity.is_evidence?)

    # mark all finished anonymous sessions as final score.
    if user.nil?
      update_columns(is_final_score: true)
      return
    end

    a = ActivitySession.where(classroom_unit: classroom_unit, user: user, is_final_score: true, activity: activity)
                       .where.not(id: id).first
    if a.nil?
      update_columns is_final_score: true
    elsif a.percentage.nil? || percentage >= a.percentage
      update_columns is_final_score: true
      a.update_columns is_final_score: false
    end
    # return true otherwise save will be prevented
    true
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  def formatted_due_date
    return nil if unit_activity&.due_date.nil?

    unit_activity.due_date.strftime('%A, %B %d, %Y')
  end

  def formatted_completed_at
    return nil if completed_at.nil?

    completed_at.strftime('%A, %B %d, %Y')
  end

  def display_due_date_or_completed_at_date
    if completed_at.present?
      (completed_at.strftime('%A, %B %d, %Y')).to_s
    elsif unit_activity.present? and unit_activity.due_date.present?
      (unit_activity.due_date.strftime('%A, %B %d, %Y')).to_s
    else
      ""
    end
  end

  def percentile
    ProficiencyEvaluator.lump_into_center_of_proficiency_band(percentage)
  end

  def percentage_as_decimal
    percentage.try(:round, 2)
  end

  def percentage_as_percent
    if percentage.nil?
      "no percentage"
    else
      "#{(percentage*100).round}%"
    end
  end

  def score
    (percentage*100).round
  end

  def uses_feedback_history?
    activity&.uses_feedback_history?
  end

  def start
    return if state != 'unstarted'

    self.started_at ||= Time.current
    self.state = 'started'
  end

  def data=(input)
    data_will_change!
    self['data'] = data.to_h.update(input.except("activity_session"))
  end

  def activity_uid= uid
    self.activity_id = Activity.find_by_uid!(uid).id
  end

  def activity_uid
    activity.try(:uid)
  end

  def completed?
    completed_at.present?
  end

  def grade
    percentage
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def parse_for_results
    concept_results_by_concept = concept_results.group_by { |c| c.concept_id }

    results = {
      PROFICIENT => [],
      NEARLY_PROFICIENT => [],
      NOT_YET_PROFICIENT => []
    }

    concept_results_by_concept.each do |concept_id, arr|
      concept = Concept.find_by_id(concept_id)
      if CONCEPT_UIDS_TO_EXCLUDE_FROM_REPORT.include?(concept.uid) && arr.length < 4
        next
      end

      number_correct = arr.inject(0) { |sum, cr| sum + (cr.correct ? 1 : 0) }
      average_correct = number_correct.to_f / arr.length

      if average_correct >= ProficiencyEvaluator.proficiency_cutoff
        results[PROFICIENT].push(concept.name)
      elsif average_correct >= ProficiencyEvaluator.nearly_proficient_cutoff
        results[NEARLY_PROFICIENT].push(concept.name)
      else
        results[NOT_YET_PROFICIENT].push(concept.name)
      end
    end

    results
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  alias owner user

  # TODO: legacy fix
  def anonymous= anonymous
    self.temporary = anonymous
  end

  def anonymous
    temporary
  end

  def invalidate_activity_session_count_if_completed
    classroom_id = classroom_unit&.classroom_id
    return unless state == 'finished' && classroom_id

    $redis.del("classroom_id:#{classroom_id}_completed_activity_count")
  end

  def self.save_concept_results(activity_sessions, concept_results)
    concept_results.each do |concept_result|
      activity_session_id = activity_sessions.find do |activity_session|
        if activity_session && concept_result
          activity_session[:uid] == concept_result[:activity_session_uid]
        end
      end&.id
      concept = Concept.find_by_id_or_uid(concept_result[:concept_id])
      concept_result[:metadata] = concept_result[:metadata]
      concept_result[:concept_id] = concept.id
      concept_result[:activity_session_id] = activity_session_id
      concept_result.delete(:activity_session_uid)

      SaveActivitySessionConceptResultsWorker.perform_async({
        concept_id: concept_result[:concept_id],
        question_type: concept_result[:question_type],
        activity_session_id: concept_result[:activity_session_id],
        metadata: concept_result[:metadata],
      })
    end
    report_invalid_concept_results(concept_results)
  end

  def self.report_invalid_concept_results(concept_results)
    return unless concept_results.any? { |cr| cr[:activity_session_id].blank? }

    ErrorNotifier.report(
      ConceptResultSubmittedWithoutActivitySessionError.new(
        "Received a request to record a ConceptResult with no related ActivitySession."
      )
    )
  end

  # this function is only for use by Lesson activities, which are not individually saved when the activity ends
  # other activity types make a call directly to the api/v1/activity_sessions controller with timetracking data included
  def self.save_timetracking_data_from_active_activity_session(activity_sessions)
    activity_sessions.each do |as|
      time_tracking = ActiveActivitySession.find_by_uid(as.uid)&.data&.fetch("timeTracking")
      as.data['time_tracking'] = time_tracking&.transform_values{ |milliseconds| (milliseconds / 1000).round } # timetracking is stored in milliseconds for active activity sessions, but seconds on the activity session
      as.timespent = as.timespent
      as.save
    end
  end

  def self.mark_all_activity_sessions_complete(activity_sessions, data={})
    activity_sessions.each do |as|
      as.update(
        state: 'finished',
        percentage: 1,
        completed_at: Time.current,
        data: data,
        is_final_score: true
      )
    end
  end

  def self.assign_follow_up_lesson(classroom_unit_id, activity_uid)
    activity = Activity.find_by_id_or_uid(activity_uid)
    classroom_unit = ClassroomUnit.find(classroom_unit_id)

    if activity.follow_up_activity_id.nil?
      return false
    end

    follow_up_activity = Activity.find_by(id: activity.follow_up_activity_id)
    unit_activity = UnitActivity.unscoped.find_or_create_by(
      activity: follow_up_activity,
      unit_id: classroom_unit.unit_id
    )

    unit_activity.update(visible: true)

    state = ClassroomUnitActivityState.find_or_create_by(
      unit_activity: unit_activity,
      classroom_unit: classroom_unit,
    )

    state.update(locked: false)
    unit_activity
  end

  def self.generate_activity_url(classroom_unit_id, activity_id)
    "#{ENV['DEFAULT_URL']}/activity_sessions/classroom_units/#{classroom_unit_id}/activities/#{activity_id}"
  end

  def self.find_or_create_started_activity_session(student_id, classroom_unit_id, activity_id)
    activity = Activity.find_by_id_or_uid(activity_id)
    activity_sessions = ActivitySession.where(
      classroom_unit_id: classroom_unit_id,
      user_id: student_id,
      activity: activity
    )

    started_session = activity_sessions.find { |as| as.state == 'started' }
    return started_session if started_session

    unstarted_session = activity_sessions.find { |as| as.state == 'unstarted' }
    if unstarted_session
      unstarted_session.update(state: 'started')
      return unstarted_session
    end

    ActivitySession.create(
      classroom_unit_id: classroom_unit_id,
      user_id: student_id,
      activity: activity,
      state: 'started',
      started_at: Time.current
    )
  end

  def minutes_to_complete
    return nil unless completed_at && started_at

    ((completed_at - started_at)/60).round
  end

  def skills
    @skills ||= activity.skills.uniq
  end

  def correct_skill_ids
    correct_skills.map(&:id)
  end

  # when using this method, you should eager load ass
  # e.g. .includes(:concept_results, activity: {skills: :concepts})
  def correct_skills
    @correct_skills ||= begin
      skills.select do |skill|
        results = concept_results.select {|cr| cr.concept_id.in?(skill.concept_ids)}

        results.length && results.all?(&:correct)
      end
    end
  end

  private def correctly_assigned
    if classroom_unit && (classroom_unit.validate_assigned_student(user_id) == false)
      ErrorNotifier.report(StudentNotAssignedActivityError.new)
      errors.add(:incorrectly_assigned, "student was not assigned this activity")
    else
      true
    end
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def self.search_sort_sql(sort)
    if sort.blank? or sort[:field].blank?
      sort = {
        field: 'student_name',
      }
    end

    if sort[:direction] == 'desc'
      order = 'desc'
    else
      order = 'asc'
    end

    # The matching names for this case statement match those returned by
    # the progress reports ActivitySessionSerializer and used as
    # column definitions in the corresponding React component.
    last_name = "substring(users.name, '(?=\s).*')"

    case sort[:field]
    when 'activity_classification_name'
      Arel.sql("activity_classifications.name #{order}, #{last_name} #{order}")
    when 'student_name'
      Arel.sql("#{last_name} #{order}, users.name #{order}")
    when 'completed_at'
      "activity_sessions.completed_at #{order}"
    when 'activity_name'
      "activities.name #{order}"
    when 'percentage'
      "activity_sessions.percentage #{order}"
    when 'standard'
      "standards.name #{order}"
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  private def trigger_events
    yield # http://stackoverflow.com/questions/4998553/rails-around-callbacks

    return unless saved_change_to_state?
    return unless state == 'finished'

    FinishActivityWorker.perform_async(uid)
  end

  private def set_state
    self.state ||= 'unstarted'
    self.data ||= {}
  end

  private def set_activity_id
    self.activity_id = unit_activity.try(:activity_id) if activity_id.nil?
  end

  private def set_completed_at
    return unless state == 'finished'

    self.completed_at ||= Time.current
  end

  private def update_milestones
    # we check to see if it is finished because the only milestone we're checking for is the copleted idagnostic.
    # at a later date, we might have to update this check in case we want a milestone for sessions being assigned
    # or started.
    return unless self.state == 'finished'

    UpdateMilestonesWorker.perform_async(uid)
  end

  private def increment_counts
    return unless finished?
    return unless saved_change_to_completed_at?

    UserActivityClassification.count_for(user, classification)
  end

  def self.has_a_completed_session?(activity_id_or_ids, classroom_unit_id_or_ids)
    !!ActivitySession.find_by(classroom_unit_id: classroom_unit_id_or_ids, activity_id: activity_id_or_ids, state: "finished")
  end

  def self.has_a_started_session?(activity_id_or_ids, classroom_unit_id_or_ids)
    !!ActivitySession.find_by(classroom_unit_id: classroom_unit_id_or_ids, activity_id: activity_id_or_ids, state: "started")
  end

  private def record_teacher_activity_feed
    teachers.each { |teacher| TeacherActivityFeed.add(teacher.id, id) }
  end
end

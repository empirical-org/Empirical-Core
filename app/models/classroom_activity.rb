class ClassroomActivity < ActiveRecord::Base
  include CheckboxCallback
  include ::NewRelic::Agent
  include AtomicArrays

  belongs_to :classroom
  belongs_to :activity
  belongs_to :unit, touch: true
  has_one :topic, through: :activity
  has_many :activity_sessions

  default_scope { where(visible: true) }
  scope :with_topic, ->(tid) { joins(:topic).where(topics: {id: tid}) }

  validate :not_duplicate, :on => :create

  validates_uniqueness_of :pinned, scope: :classroom_id,
    if: Proc.new { |ca| ca.pinned == true }

  before_validation :check_pinned
  before_save :check_for_assign_on_join_and_update_students_array_if_true
  after_create :lock_if_lesson
  after_save :teacher_checkbox, :hide_appropriate_activity_sessions, :update_lessons_cache, :post_to_google

  def assigned_students
    User.where(id: assigned_student_ids)
  end

  def check_for_assign_on_join_and_update_students_array_if_true
    student_ids = StudentsClassrooms.where(classroom_id: self.classroom_id).pluck(:student_id)
    if self.assigned_student_ids&.any? && !self.assign_on_join && self.assigned_student_ids.length >= student_ids.length
      # then maybe it should be assign on join, so we do a more thorough check
      if (assigned_student_ids - student_ids).empty?
        # then it should indeed be assigned to all
        self.assign_on_join = true
      end
    end
    if self.assign_on_join
      # then we ensure that it has all the student ids
      self.assigned_student_ids = student_ids
    end
  end

  def assign_follow_up_lesson(locked=true)
    extant_ca = ClassroomActivity.find_by(classroom_id: self.classroom_id,
                                          activity_id: self.activity.follow_up_activity_id,
                                          unit_id: self.unit_id)
    if !self.activity.follow_up_activity_id
      return false
    elsif extant_ca
      extant_ca.update(locked: false)
      return extant_ca
    end
    follow_up = ClassroomActivity.create(classroom_id: self.classroom_id,
                             activity_id: self.activity.follow_up_activity_id,
                             unit_id: self.unit_id,
                             visible: true,
                             locked: locked,
                             assign_on_join: self.assign_on_join,
                             assigned_student_ids: self.assigned_student_ids )
    follow_up
  end

  def save_concept_results classroom_concept_results
    acts = self.activity_sessions.select(:id, :uid)
    classroom_concept_results.each do |concept_result|
      activity_session_id = acts.find { |act| act[:uid] == concept_result["activity_session_uid"]}[:id]
      concept_result["activity_session_id"] = activity_session_id
      concept_result.delete("activity_session_uid")
    end
    classroom_concept_results.each do |concept_result|
      ConceptResult.create(concept_result)
    end
  end

  def delete_activity_sessions_with_no_concept_results
    incomplete_activity_session_ids = []
    self.activity_sessions.each do |as|
      if as.concept_result_ids.empty?
        incomplete_activity_session_ids.push(as.id)
      end
    end
    ActivitySession.where(id: incomplete_activity_session_ids).destroy_all
  end

  def find_or_create_started_activity_session(student_id)
    activity_session = ActivitySession.find_by(classroom_activity_id: self.id, user_id: student_id)
    if activity_session && activity_session.state == 'started'
      activity_session
    elsif activity_session && activity_session.state == 'unstarted'
      activity_session.update(state: 'started')
      activity_session
    else
      ActivitySession.create(classroom_activity_id: self.id, user_id: student_id, activity_id: self.activity_id, state: 'started', started_at: Time.now)
    end
  end

  def due_date_string= val
    self.due_date = Date.strptime(val, Time::DATE_FORMATS[:quill_default])
  end

  def due_date_string
    due_date.try(:to_formatted_s, :quill_default)
  end

  def mark_all_activity_sessions_complete(data={})
    ActivitySession.unscoped.where(classroom_activity_id: self.id).update_all(state: 'finished', percentage: 1, completed_at: Time.current, data: data, is_final_score: true)
  end

  def activity_session_metadata
    act_seshes = activity_sessions.where(is_final_score: true).includes(concept_results: :concept)
    act_seshes.map{|act_sesh| act_sesh.concept_results.map{|cr| cr.metadata}}.flatten
  end

  def teacher_and_classroom_name
    {teacher: classroom&.owner&.name, classroom: classroom&.name}
  end

  def formatted_due_date
    if due_date.present?
      due_date.month.to_s + "-" + due_date.day.to_s + "-" + due_date.year.to_s
    else
      ""
    end
  end

  def has_a_completed_session?
    !!activity_sessions.find_by(classroom_activity_id: self.id, state: "finished")
  end

  def has_a_started_session?
    !!activity_sessions.find_by(classroom_activity_id: self.id, state: "started")
  end

  def from_valid_date_for_activity_analysis?
    classification_id = self.activity.classification.id
    # if it is passage proofreader or sentence writing, we only want to show ones after this Date in certain reports
    # as previous to that date, concept results were not compatible with reports
    if [1,2].include?(classification_id)
      self.created_at > Date.parse('25-10-2016')
    else
      true
    end
  end

  def scorebook
    @score_book = {}
    completed.each do |activity_session|

      new_score = {activity: activity_session.activity, session: activity_session, score: activity_session.percentage}

      user = @score_book[activity_session.user.id] ||= {}

      user[activity_session.activity.uid] ||= new_score
    end

    @score_book
  end

  def teacher_checkbox
    if self.classroom && self.classroom.owner
      owner = self.classroom.owner
      checkbox_name = checkbox_type
      if owner && self.unit && self.unit.name
        find_or_create_checkbox(checkbox_name, owner)
      end
    end
  end

  def hide_appropriate_activity_sessions
    # on save callback that checks if archived
    if self.visible == false
      hide_all_activity_sessions
      return
    end
    hide_unassigned_activity_sessions
  end

  def hide_unassigned_activity_sessions
    #validate or hides any other related activity sessions
    act_seshes = self.activity_sessions
    if act_seshes
      act_seshes.each do |as|
        # We are explicitly checking to ensure that the student here actually belongs
        # in this classroom before running the validate_assigned_student method because
        # if this is not true, validate_assigned_student starts an infinite loop! 😨
        if !StudentsClassrooms.find_by(classroom_id: self.classroom_id, student_id: as.user_id)
          as.update(visible: false)
        elsif !validate_assigned_student(as.user_id)
          as.update(visible: false)
        end
      end
    end
  end

  def hide_all_activity_sessions
    self.activity_sessions.update_all(visible: false)
  end

  def check_pinned
    if self.pinned == true
      if self.visible == false
        # unpin ca before archiving
        self.update!(pinned: false)
      else
        # unpin any other pinned ca before pinning new one
        pinned_ca = ClassroomActivity.unscoped.find_by(classroom_id: self.classroom_id, pinned: true)
        return if pinned_ca && pinned_ca == self
        pinned_ca.update_column("pinned", false) if pinned_ca
      end
    end
  end

  class << self
    def create_session(activity, options = {})
      classroom_activity = where(activity_id: activity.id, classroom_id: options[:user].classrooms.last.id).first_or_create
      classroom_activity.activity_sessions.create!(user: options[:user])
    end
  end


  def checkbox_type
    if self.activity_id == 413 || self.activity_id == 447 || self.activity_id == 602
      checkbox_name = 'Assign Entry Diagnostic'
    elsif self.unit && self.unit.unit_template_id
      checkbox_name = 'Assign Featured Activity Pack'
    else
      checkbox_name = 'Build Your Own Activity Pack'
    end
  end

  def validate_assigned_student(student_id)
    if self.assign_on_join
      if !self.assigned_student_ids || self.assigned_student_ids.exclude?(student_id)
        if !self.assigned_student_ids.kind_of?(Array)
          self.update(assigned_student_ids: [])
        end
        self.update(assigned_student_ids: StudentsClassrooms.where(classroom_id: self.classroom_id).pluck(:student_id))
      end
      true
    else
      self.assigned_student_ids && self.assigned_student_ids.include?(student_id)
    end
  end

  def lessons_cache_info_formatter
    {"classroom_activity_id" => self.id, "activity_id" => activity.id, "activity_name" => activity.name, "unit_id" => self.unit_id, "completed" => self.has_a_completed_session? || self.completed}
  end

  def post_to_google
    classroom_google_id = classroom&.google_classroom_id
    if classroom_google_id
      access_token = $redis.get("user_id:#{classroom.owner.id}_google_access_token")
      if access_token
        GoogleIntegration::CourseWork.post(access_token, self, classroom_google_id)
      end
    end
  end

  private

  def lock_if_lesson
    if ActivityClassification.find_by_id(activity&.activity_classification_id)&.key == 'lessons'
      self.update(locked: true)
    end
  end

  def format_initial_lessons_cache
    # grab all classroom activities from the current ones's teacher, filter the lessons, then parse them
    self.classroom.owner.classroom_activities.select{|ca| ca.activity.activity_classification_id == 6}.map{|ca| ca.lessons_cache_info_formatter}
  end

  def update_lessons_cache
    if ActivityClassification.find_by_id(activity&.activity_classification_id)&.key == 'lessons'
      user_ids = ClassroomsTeacher.where(classroom_id: self.classroom_id).map(&:user_id)
      user_ids.each do |user_id|
        lessons_cache = $redis.get("user_id:#{user_id}_lessons_array")
        if lessons_cache
          lessons_cache = JSON.parse(lessons_cache)
          formatted_lesson = lessons_cache_info_formatter
          lesson_index_in_cache = lessons_cache.find_index { |l| l['classroom_activity_id'] == formatted_lesson['classroom_activity_id']}
          if self.visible == true && !lesson_index_in_cache
            lessons_cache.push(formatted_lesson)
          elsif self.visible == false && lesson_index_in_cache
            lessons_cache.delete(formatted_lesson)
          elsif self.completed && lesson_index_in_cache
            lessons_cache[lesson_index_in_cache] = formatted_lesson
          end
        else
          lessons_cache = format_initial_lessons_cache
        end
        $redis.set("user_id:#{user_id}_lessons_array", lessons_cache.to_json)
      end
    end
  end

  def not_duplicate
    if ClassroomActivity.find_by(classroom_id: self.classroom_id, activity_id: self.activity_id, unit_id: self.unit_id, visible: self.visible)
      begin
        raise 'This classroom activity is a duplicate'
      rescue => e
        NewRelic::Agent.add_custom_attributes({
          classroom_id: self.classroom_id,
          activity_id: self.activity_id,
          unit_id: self.unit_id,
          visible: self.visible
        })
        NewRelic::Agent.notice_error(e)
        errors.add(:duplicate_classroom_activity, "this classroom activity is a duplicate")
      end
    else
      return true
    end
  end

end

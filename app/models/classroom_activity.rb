class ClassroomActivity < ActiveRecord::Base
  include CheckboxCallback
  include ::NewRelic::Agent

  belongs_to :classroom
  belongs_to :activity
  belongs_to :unit, touch: true
  has_one :topic, through: :activity
  has_many :activity_sessions

  default_scope { where(visible: true) }
  scope :with_topic, ->(tid) { joins(:topic).where(topics: {id: tid}) }

  validate :not_duplicate, :on => :create

  after_create :assign_to_students, :lock_if_lesson
  after_save :teacher_checkbox, :assign_to_students, :hide_appropriate_activity_sessions

  def assigned_students
    User.where(id: assigned_student_ids)
  end



  def due_date_string= val
    self.due_date = Date.strptime(val, Time::DATE_FORMATS[:quill_default])
  end

  def due_date_string
    due_date.try(:to_formatted_s, :quill_default)
  end

  def session_for user
    ass = ActivitySession.unscoped.where(classroom_activity: self, user: user, activity: activity).includes(:activity).order(created_at: :asc)
    if ass.any?
      if ass.any? { |as| as.is_final_score }
        keeper = ass.find { |as| as.is_final_score}
      # the next two cases should not be necessary to handle
      # since the highest score should always have .is_final_score
      # and only one should be started at a time,
      # but due to some data confusion we're going to leave it in for now
      elsif ass.any? { |as| as.state == 'finished' }
        keeper = ass.find_all { |as| as.state == 'finished' }.sort_by { |as| as.percentage }.first
      elsif ass.any? { |as| as.state == 'started' }
        keeper = ass.find_all { |as| as.state == 'started' }.sort_by { |as| as.updated_at }.last
      else
        keeper = ass.sort_by { |as| as.updated_at }.last
      end
      keeper.update(visible: true)
      return keeper
    else
      activity_sessions.create(user: user, activity: activity)
    end

    # if as.save
    #
    # else
    #   if as.errors[""]
    #     begin
    #
    #     rescue
    #
    #     end
    # end
  end

  def activity_session_metadata
    act_seshes = activity_sessions.where(is_final_score: true).includes(concept_results: :concept)
    act_seshes.map{|act_sesh| act_sesh.concept_results.map{|cr| cr.metadata}}.flatten
  end

  def for_student? student
    return true if assigned_student_ids.nil? || assigned_student_ids.empty?
    assigned_student_ids.include?(student.id)
  end

  def students
    if assigned_student_ids && assigned_student_ids.any?
      User.where(id: assigned_student_ids)
    else
      classroom.students
    end
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

  def completed
    activity_sessions.completed.includes([:user, :activity]).joins(:user).where('users.role' == 'student')
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

  def assign_to_students
    # sometimes a student can be one student object rather than an array
    assignees = [students].flatten
    assignees.each do |student|
      session_for(student)
    end
  end

  def teacher_checkbox
    if self.classroom && self.classroom.teacher
      teacher = self.classroom.teacher
      checkbox_name = checkbox_type
      if teacher && self.unit && self.unit.name
        find_or_create_checkbox(checkbox_name, teacher)
      end
    end
  end

  def sibling_due_date
    ClassroomActivity.where(unit_id: self.unit_id, activity_id: self.activity_id, classroom_id: self.classroom_id)
                      .where.not(due_date: nil).limit(1).pluck(:due_date).first
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
    self.activity_sessions.each do |as|
      if !validate_assigned_student(as.user_id)
        as.update(visible: false)
      end
    end
  end

  def hide_all_activity_sessions
    self.activity_sessions.each do |as|
      as.update(visible: false)
    end
  end

  class << self
    def create_session(activity, options = {})
      classroom_activity = where(activity_id: activity.id, classroom_id: options[:user].classrooms.last.id).first_or_create
      classroom_activity.activity_sessions.create!(user: options[:user])
    end
  end


  def checkbox_type
    if self.activity_id == 413 || self.activity_id == 447
      checkbox_name = 'Assign Entry Diagnostic'
    elsif self.unit && UnitTemplate.find_by_name(self.unit.name)
      checkbox_name = 'Assign Featured Activity Pack'
    else
      checkbox_name = 'Build Your Own Activity Pack'
    end
  end

  def validate_assigned_student(student_id)
    if (self.assigned_student_ids == []) || self.assigned_student_ids.nil?
      true
    else
      self.assigned_student_ids.include?(student_id)
    end
  end

  private

  def lock_if_lesson
    if ActivityClassification.find_by_id(activity&.activity_classification_id)&.key == 'lessons'
      self.update(locked: true)
    end
  end

  def not_duplicate
    if ClassroomActivity.find_by(classroom_id: self.classroom_id, activity_id: self.activity_id, unit_id: self.unit_id, visible: self.visible)
      begin
        raise 'This classroom activity is a duplicate'
      rescue => e
        NewRelic::Agent.notice_error(e)
        errors.add(:duplicate_classroom_activity, "this classroom activity is a duplicate")
      end
    else
      return true
    end
  end

end

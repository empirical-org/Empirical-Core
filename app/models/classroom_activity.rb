class ClassroomActivity < ActiveRecord::Base
  include CheckboxCallback


  belongs_to :classroom
  belongs_to :activity
  belongs_to :unit, touch: true
  has_one :topic, through: :activity
  has_many :activity_sessions, dependent: :destroy

  default_scope { where(visible: true) }
  scope :with_topic, ->(tid) { joins(:topic).where(topics: {id: tid}) }


  after_create :assign_to_students
  after_save :teacher_checkbox

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
    ass = activity_sessions.where(user: user, activity: activity).order(created_at: :asc)
    as = if ass.any? then ass.first else activity_sessions.create(user: user, activity: activity) end
  end

  def for_student? student
    return true if assigned_student_ids.nil? || assigned_student_ids.empty?
    assigned_student_ids.include?(student.id)
  end

  def students
    if assigned_student_ids.try(:any?)
      User.find(assigned_student_ids)
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
    students.each do |student|
      session_for(student)
    end
  end


  def teacher_checkbox
    teacher = self.classroom.teacher
    if teacher && self.unit && self.unit.name
      if UnitTemplate.find_by_name(self.unit.name)
        checkbox_name = 'Assign Featured Activity Pack'
      else
        checkbox_name = 'Build Your Own Activity Pack'
      end
      find_or_create_checkbox(checkbox_name, teacher)
    end
  end

  class << self
    def create_session(activity, options = {})
      classroom_activity = where(activity_id: activity.id, classroom_id: options[:user].classrooms.last.id).first_or_create
      classroom_activity.activity_sessions.create!(user: options[:user])
    end
  end



end

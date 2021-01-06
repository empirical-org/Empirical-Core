class Classroom < ActiveRecord::Base
  include CheckboxCallback

  GRADES = %w(1 2 3 4 5 6 7 8 9 10 11 12 University)
  UNIVERSITY= "University"
  GRADE_INTEGERS = {Kindergarten: 0, University: 13, PostGraduate: 14}

  validates_uniqueness_of :code
  validates_presence_of :name
  validate :validate_name
  default_scope { where(visible: true)}

  after_commit :hide_appropriate_classroom_units
  after_commit :trigger_analytics_for_classroom_creation, on: :create

  has_many :classroom_units
  has_many :units, through: :classroom_units
  has_many :unit_activities, through: :units
  has_many :activities, through: :unit_activities
  has_many :activity_sessions, through: :classroom_units
  has_many :standard_levels, through: :activities
  has_many :coteacher_classroom_invitations

  has_many :students_classrooms, foreign_key: 'classroom_id', dependent: :destroy, class_name: "StudentsClassrooms"
  has_many :students, through: :students_classrooms, source: :student, inverse_of: :classrooms, class_name: "User"

  has_many :classrooms_teachers, foreign_key: 'classroom_id'
  has_many :teachers, through: :classrooms_teachers, source: :user

  before_validation :set_code, if: proc {|c| c.code.blank?}


  def validate_name
    return unless name_changed?
    # can't use owner method below for new records
    owner = classrooms_teachers&.find { |ct| ct.role == 'owner' }&.teacher
    owner_has_other_classrooms_with_same_name = owner && owner.classrooms_i_own.any? { |classroom| classroom.name == name && classroom.id != id }
    if owner_has_other_classrooms_with_same_name
      errors.add(:name, :taken)
    end
  end

  def self.create_with_join(classroom_attributes, teacher_id)
    classroom = Classroom.new(classroom_attributes)
    classroom.classrooms_teachers.build(user_id: teacher_id, role: 'owner')
    classroom.save
    classroom
  end

  def units_json
    units.select('units.id AS value, units.name')
         .where(classroom_units: {visible: true})
         .distinct.order('units.name').as_json(except: :id)
  end

  def unique_standard_count
    if unique_standard_count_array.any?
      val = unique_standard_count_array.first.standard_count
    else
      val = nil
    end
    val
  end

  def owner
    classrooms_teachers.includes(:user).find_by_role('owner')&.teacher
  end

  def coteachers
    classrooms_teachers.includes(:user).where(role: 'coteacher').map(&:teacher)
  end

  def unique_standard_count_array
    filters = {}
    best_activity_sessions = ProgressReports::Standards::ActivitySession.new(owner).results(filters)
    ActivitySession.from_cte('best_activity_sessions', best_activity_sessions)
      .select("COUNT(DISTINCT(activities.standard_id)) as standard_count")
      .joins('JOIN activities ON activities.id = best_activity_sessions.activity_id')
      .joins('JOIN classroom_units ON classroom_units.id = best_activity_sessions.classroom_unit_id')
      .where('classroom_units.classroom_id = ?', id)
      .group('classroom_units.classroom_id')
      .order('')
  end

  def self.setup_from_clever(section, teacher)
    c = Classroom.where(clever_id: section.id).includes(:units).first_or_initialize
    c.update_attributes(
      name: section.name,
      grade: section.grade
    )
    ClassroomsTeacher.find_or_create_by(user: teacher, role: 'owner', classroom: c)
    c.import_students!
    c
  end

  def archived_classrooms_manager
    coteachers = !self.coteachers.empty? ? self.coteachers.map { |ct| { name: ct.name, id: ct.id, email: ct.email } } : []
    {createdDate: created_at.strftime("%m/%d/%Y"), className: name, id: id, studentCount: students.count, classcode: code, ownerName: owner.name, from_google: !!google_classroom_id, coteachers: coteachers}
  end

  def import_students!
    clever_students = clever_classroom.students

    existing_student_ids = students.pluck(&:clever_id).uniq.compact
    students_to_add = clever_students.reject {|s| existing_student_ids.include?(s.id) }
    new_students = students_to_add.collect {|s| User.create_from_clever({info: s}, 'student')}

    students << new_students
  end

  def set_code
    self.code = Classroom.generate_unique_code
  end

  def self.generate_unique_code
    code = NameGenerator.generate
    if Classroom.unscoped.find_by_code(code)
       generate_unique_code
    else
      code
    end
  end

  def hide_appropriate_classroom_units
    # on commit callback that checks if archived
    if visible == false
      hide_all_classroom_units
    end
  end

  def hide_all_classroom_units
    ActivitySession.where(classroom_unit: classroom_units).update_all(visible: false)
    classroom_units.update_all(visible: false)
    SetTeacherLessonCache.perform_async(owner.id)
    ids = Unit.find_by_sql("
      SELECT unit.id FROM units unit
      LEFT JOIN classroom_units as cu ON cu.unit_id = unit.id AND cu.visible = true
      WHERE unit.visible = true
      AND cu.id IS null
      AND unit.user_id = #{owner.id}")
    Unit.where(id: ids).update_all(visible: false)
  end

  def with_students
    attributes.merge({students: students})
  end

  def with_students_ids
    attributes.merge({student_ids: students.ids})
  end

  def classroom_type_for_segment
    if google_classroom_id
      'Google Classroom'
    elsif clever_id
      'Clever'
    else
      'Manual'
    end
  end

  def grade_as_integer
    return grade.to_i if (GRADES - [UNIVERSITY]).include? grade
    return GRADE_INTEGERS[grade&.to_sym] if GRADE_INTEGERS[grade&.to_sym].present?
    -1
  end

  private

  # Clever integration
  def clever_classroom
    Clever::Section.retrieve(clever_id, teacher.districts.first.token)
  end

  def trigger_analytics_for_classroom_creation
    find_or_create_checkbox('Create a Classroom', owner)
    ClassroomCreationWorker.perform_async(id)
  end

end

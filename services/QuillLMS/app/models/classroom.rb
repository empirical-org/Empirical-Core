# frozen_string_literal: true

# == Schema Information
#
# Table name: classrooms
#
#  id                  :integer          not null, primary key
#  code                :string
#  grade               :string
#  grade_level         :integer
#  name                :string
#  synced_name         :string
#  visible             :boolean          default(TRUE), not null
#  created_at          :datetime
#  updated_at          :datetime
#  clever_id           :string
#  google_classroom_id :bigint
#  teacher_id          :integer
#
# Indexes
#
#  index_classrooms_on_clever_id            (clever_id)
#  index_classrooms_on_code                 (code)
#  index_classrooms_on_google_classroom_id  (google_classroom_id)
#  index_classrooms_on_grade                (grade)
#  index_classrooms_on_grade_level          (grade_level)
#  index_classrooms_on_teacher_id           (teacher_id)
#
class Classroom < ApplicationRecord
  include CheckboxCallback

  GRADES = %w(1 2 3 4 5 6 7 8 9 10 11 12 University)
  UNIVERSITY = "University"
  GRADE_INTEGERS = {Kindergarten: 0, University: 13, PostGraduate: 14}

  validates_uniqueness_of :code
  validates_presence_of :name
  validate :validate_name
  default_scope { where(visible: true)}

  after_commit :hide_appropriate_classroom_units
  after_commit :trigger_analytics_for_classroom_creation, on: :create

  after_save :reset_teacher_activity_feed, if: :saved_change_to_visible?

  has_many :classroom_units, dependent: :destroy
  has_many :units, through: :classroom_units
  has_many :unit_activities, through: :units
  has_many :activities, through: :unit_activities
  has_many :activity_sessions, through: :classroom_units
  has_many :standard_levels, through: :activities
  has_many :coteacher_classroom_invitations, dependent: :destroy
  has_many :pack_sequences, dependent: :destroy

  has_many :students_classrooms, foreign_key: 'classroom_id', dependent: :destroy, class_name: "StudentsClassrooms"
  has_many :students, through: :students_classrooms, source: :student, inverse_of: :classrooms, class_name: "User"

  has_many :classrooms_teachers, foreign_key: 'classroom_id'
  has_many :teachers, through: :classrooms_teachers, source: :user

  before_validation :set_code, if: proc {|c| c.code.blank?}

  accepts_nested_attributes_for :classrooms_teachers

  def destroy
    # ClassroomsTeachers must be called explicitly, because the has_many relationship
    # does not retrieve Classroom.classrooms_teachers when a foreign_key is designated, as above
    # https://github.com/empirical-org/Empirical-Core/pull/8664
    ClassroomsTeacher.where(classroom_id: id).destroy_all
    super
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def validate_name
    return unless name_changed?

    # can't use owner method below for new records
    owner = classrooms_teachers&.find { |ct| ct.role == 'owner' }&.teacher
    owner_has_other_classrooms_with_same_name = owner && owner.classrooms_i_own.any? { |classroom| classroom.name == name && classroom.id != id }
    return unless owner_has_other_classrooms_with_same_name

    errors.add(:name, :taken)
  end
  # rubocop:enable Metrics/CyclomaticComplexity

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
    unique_standard_count_array&.first&.standard_count
  end

  def owner
    classrooms_teachers.includes(:user).find_by_role('owner')&.teacher
  end

  def coteachers
    classrooms_teachers.includes(:user).where(role: 'coteacher').map(&:teacher)
  end

  def unique_standard_count_array
    best_activity_sessions = ProgressReports::Standards::ActivitySession.new(owner).results.to_sql

    ActivitySession
      .select("COUNT(DISTINCT(activities.standard_id)) as standard_count")
      .joins("JOIN (#{best_activity_sessions}) AS best_activity_sessions ON activity_sessions.id = best_activity_sessions.id")
      .joins('JOIN activities ON activities.id = best_activity_sessions.activity_id')
      .joins('JOIN classroom_units ON classroom_units.id = best_activity_sessions.classroom_unit_id')
      .where('classroom_units.classroom_id = ?', id)
      .group('classroom_units.classroom_id')
      .order(standard_count: :desc)
  end

  def archived_classrooms_manager
    coteachers = self.coteachers.map { |ct| { name: ct.name, id: ct.id, email: ct.email } }
    {createdDate: created_at.strftime("%m/%d/%Y"), className: name, id: id, studentCount: students.count, classcode: code, ownerName: owner.name, from_google: !!google_classroom_id, coteachers: coteachers}
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
    return if visible
    return unless visible_changed?

    hide_all_classroom_units
  end

  def hide_all_classroom_units
    ActivitySession.where(classroom_unit: classroom_units).update_all(visible: false)
    classroom_units.update_all(visible: false)
    return if owner.nil?

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

  def provider_classroom?
    google_classroom? || clever_classroom?
  end

  def clever_classroom?
    clever_id.present?
  end

  def google_classroom?
    google_classroom_id.present?
  end

  def provider_classroom
    return 'Google Classroom' if google_classroom?
    return 'Clever' if clever_classroom?
  end

  # Clever integration
  private def clever_classroom
    Clever::Section.retrieve(clever_id, teacher.districts.first.token)
  end

  private def trigger_analytics_for_classroom_creation
    classrooms_teachers.each { |ct| find_or_create_checkbox(Objective::CREATE_A_CLASSROOM, ct.user) }
    ClassroomCreationWorker.perform_async(id)
  end

  private def reset_teacher_activity_feed
    teachers.each do |teacher|
      TeacherActivityFeedRefillWorker.perform_async(teacher.id)
    end
  end

end

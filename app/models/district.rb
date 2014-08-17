class District < ActiveRecord::Base
  has_and_belongs_to_many :users

  def self.setup_from_clever(auth_hash)
    district = District.where(clever_id: auth_hash[:info][:id]).first_or_initialize
    district.import_from_clever! if district.new_record?
    district.update_attributes(name: auth_hash[:info][:name], token: auth_hash[:credentials][:token])
    district
  end

  def self.create_from_clever(id)
    district = District.where(clever_id: id).first_or_initialize
    district.import_from_clever! if district.new_record?
    district.update_attributes(name: district.clever_district_name)
    district
  end

  def import_from_clever!
    clever_district.schools.each do |school|
      next unless school.nces_id

      s = School.where(nces_id: school.nces_id).first_or_initialize
      s.update_attributes(
        clever_id: s.id
      )
    end

    clever_district.teachers.each do |teacher|
      create_user_from_clever(teacher, 'teacher')
    end

    clever_district.students.each do |student|
      create_user_from_clever(student, 'student')
    end

    clever_district.sections.each do |section|
      c = Classroom.where(clever_id: section.id).first_or_initialize
      c.update_attributes(
        name: section.name,
        teacher: User.teacher.where(clever_id: section.teacher).first,
        students: User.student.where(clever_id: section.students).all
      )
    end
  end

  def clever_district_name
    clever_district.name
  end

  private

  def clever_district
    @clever_district ||= Clever::District.all.find {|d| d.id == self.clever_id}
  end

  def create_user_from_clever(clever_user, role)
    u = User.where(clever_id: clever_user.id).first_or_initialize
    u.update_attributes(
      clever_id: clever_user.id,
      email: clever_user.email,
      role: role,
      first_name: clever_user.name[:first],
      last_name: clever_user.name[:last]
    )

    s = School.where(clever_id: clever_user.school).first
    return true unless s
    s.users << u unless s.users.include?(u)
  end

end

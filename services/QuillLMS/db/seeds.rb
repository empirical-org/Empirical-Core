# frozen_string_literal: true

require 'factory_bot_rails'
include FactoryBot::Syntax::Methods

# Generate a staff user with a known username and password
create(:staff, username: 'staff', password: 'password')

# Generate authors to be referred to by unit_template seed data
20.times do
  create(:author)
end

# Generate activity classifications
create(:diagnostic)
create(:proofreader)
create(:grammar)
create(:connect)
create(:lesson)

# Generate objectives
create(:create_a_classroom)
create(:add_students)
create(:assign_featured_activity_pack)
create(:add_school)
create(:assign_entry_diagnostic)
create(:build_your_own_activity_pack)

# Generate milestones
create(:view_lessons_tutorial_milestone)
create(:complete_diagnostic_milestone)
create(:publish_customized_lesson_milestone)
create(:complete_customized_lesson_milestone)
create(:acknowledge_lessons_banner)
create(:acknowledge_diagnostic_banner)
create(:acknowledge_growth_diagnostic_promotion_card)

# Path to SQL seeds files
dir_path = "#{File.dirname(__FILE__)}/seeds/"

# Import concepts
ActiveRecord::Base.connection.execute(File.read("#{dir_path}concepts.sql"))

# Import activities
ActiveRecord::Base.connection.execute(File.read("#{dir_path}activities.sql"))

# Import categories
ActiveRecord::Base.connection.execute(File.read("#{dir_path}categories.sql"))

# Import activity categories
ActiveRecord::Base.connection.execute(File.read("#{dir_path}activity_categories.sql"))

# Import activity category activities
ActiveRecord::Base.connection.execute(File.read("#{dir_path}activity_category_activities.sql"))

# Import unit templates
ActiveRecord::Base.connection.execute(File.read("#{dir_path}unit_templates.sql"))

# Import unit template categories
ActiveRecord::Base.connection.execute(File.read("#{dir_path}unit_template_categories.sql"))

# Import activities unit templates
ActiveRecord::Base.connection.execute(File.read("#{dir_path}activities_unit_templates.sql"))

# Import standards
ActiveRecord::Base.connection.execute(File.read("#{dir_path}standards.sql"))

# Import activities standard categories
ActiveRecord::Base.connection.execute(File.read("#{dir_path}standard_categories.sql"))

# Generate standard_levels
create(:grade_1_standard_level)
create(:grade_2_standard_level)
create(:grade_3_standard_level)
create(:grade_4_standard_level)
create(:grade_5_standard_level)
create(:grade_6_standard_level)
create(:grade_7_standard_level)
create(:grade_8_standard_level)
create(:grade_9_standard_level)
create(:grade_10_standard_level)
create(:grade_11_standard_level)
create(:grade_12_standard_level)
create(:university_standard_level)

# Generate a known teacher with a few classes and students, as well as a known student in those classes
teacher = create(:teacher, username: 'teacher', password: 'password')
classrooms = create_list(:classroom, 3, :with_no_teacher)
student = create(:student, username: 'student', password: 'password')
classrooms.each do |classroom|
  create(:classrooms_teacher, classroom: classroom, user: teacher)
  classroom.students = create_list(:student, 19)
  classroom.students << student
end

# Generate a shared diagnostic unit and a couple other units for the classrooms
diagnostic_unit = create(:unit, :sentence_structure_diagnostic, user_id: teacher.id)
diagnostic_activity = Activity.find(Activity.diagnostic_activity_ids.first)
diagnostic_unit_activity = create(:unit_activity, unit: diagnostic_unit, activity: diagnostic_activity)

classrooms.each do |classroom|
  classroom_diagnostic_unit = create(:classroom_unit, unit: diagnostic_unit, classroom: classroom, assign_on_join: true)
end

# Generate Firebase apps
create(:grammar_firebase_app)

# Reset primary keys
ActiveRecord::Base.connection.tables.each do |table|
  ActiveRecord::Base.connection.reset_pk_sequence!(table)
end

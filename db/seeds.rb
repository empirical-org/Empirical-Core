require 'factory_bot_rails'
include FactoryBot::Syntax::Methods

# Generate a staff user with a known username and password
create(:staff, username: 'staff', password: 'staff')

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

# Path to SQL seeds files
dir_path = File.dirname(__FILE__) + '/seeds/'

# Import concepts
ActiveRecord::Base.connection.execute(File.read(dir_path + 'concepts.sql'))

# Import activities
ActiveRecord::Base.connection.execute(File.read(dir_path + 'activities.sql'))

# Import categories
ActiveRecord::Base.connection.execute(File.read(dir_path + 'categories.sql'))

# Import activity categories
ActiveRecord::Base.connection.execute(File.read(dir_path + 'activity_categories.sql'))

# Import activity category activities
ActiveRecord::Base.connection.execute(File.read(dir_path + 'activity_category_activities.sql'))

# Import unit templates
ActiveRecord::Base.connection.execute(File.read(dir_path + 'unit_templates.sql'))

# Import unit template categories
ActiveRecord::Base.connection.execute(File.read(dir_path + 'unit_template_categories.sql'))

# Import activities unit templates
ActiveRecord::Base.connection.execute(File.read(dir_path + 'activities_unit_templates.sql'))

# Import topics
ActiveRecord::Base.connection.execute(File.read(dir_path + 'topics.sql'))

# Import activities topic categories
ActiveRecord::Base.connection.execute(File.read(dir_path + 'topic_categories.sql'))

# Generate sections
create(:grade_1_section)
create(:grade_2_section)
create(:grade_3_section)
create(:grade_4_section)
create(:grade_5_section)
create(:grade_6_section)
create(:grade_7_section)
create(:grade_8_section)
create(:grade_9_section)
create(:grade_10_section)
create(:grade_11_section)
create(:grade_12_section)
create(:university_section)

# Generate a teacher with classes and students with activities
create(:teacher, :with_classrooms_students_and_activities, username: 'teacher', password: 'teacher')

# Generate Firebase apps
create(:grammar_firebase_app)

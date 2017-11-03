require 'factory_bot_rails'
include FactoryBot::Syntax::Methods

# Generate a staff user with a known username and password
create(:staff, username: 'staff', password: 'staff')

# Generate activity categories
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

# Generate unit templates with activities


# Generate units


# Generate classroom activities


# Generate a teacher with classes and students with activities


# Generate a teacher from Google Classroom with classes and students with activities


# Generate a teacher from Clever with classes and students with activities

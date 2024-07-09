# frozen_string_literal: true

namespace :report_demo do
  desc 'make report demo accounts'
  task :create, [:name] => :environment do |t, args|
    # call this with no arguments if you want quill.org/demo to be created. otherwise
    # to use this call rake report_demo:create["firstname lastname"]
    name = args[:name] ? args[:name].to_s : nil
    Demo::ReportDemoCreator::create_demo("hello+#{name}@quill.org")
  end

  desc 'Generate new data for the ACTIVITY_PACK_TEMPLATES'
  task :generate_new_data, [:email] => :environment do |_, args|
    user = User.find_by(email: args[:email])
    classroom = user.classrooms_i_teach.first

    result = classroom.units.map do |unit|
      {}.tap do |unit_result|
        unit_result[:name] = unit.name
        unit_result[:activity_sessions] = []

        classroom.students.each do |student|
          unit_result[:activity_sessions] <<
            student
              .activity_sessions
              .where(activity_id: unit.activities.pluck(:id))
              .to_h { |activity_session| [activity_session.activity_id, student.id] }
        end
      end
    end

    # Copy and paste result into the ACTIVITY_PACK_TEMPLATES constant in Demo::ReportDemoCreator
    # Add necessary formatting to make it look like the previous template
    puts result
  end
end

# frozen_string_literal: true

# require 'report_demo_destroyer'
# require 'report_demo_creator'
#
# include ReportDemoCreator
# include ReportDemoDestroyer

namespace :report_demo do
  desc 'make report demo accounts'
  task :create, [:name] => :environment do |t, args|
    # call this with no arguments if you want quill.org/demo to be created. otherwise
    # to use this call rake report_demo:create["firstname lastname"]
    name = args[:name] ? args[:name].to_s : nil
    Demo::ReportDemoCreator::create_demo("hello+#{name}@quill.org")
  end

  task :destroy, [:name] => :environment do |t, args|
    # to use this call rake demo:create["firstname lastname"]
    name = args[:name] ? args[:name].to_s : nil
    Demo::ReportDemoDestroyer::destroy_demo("hello+#{name}@quill.org")
  end
end

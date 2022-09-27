# frozen_string_literal: true

namespace :report_demo do
  desc 'make report demo accounts'
  task :create, [:name] => :environment do |t, args|
    # call this with no arguments if you want quill.org/demo to be created. otherwise
    # to use this call rake report_demo:create["firstname lastname"]
    name = args[:name] ? args[:name].to_s : nil
    Demo::ReportDemoCreator::create_demo("hello+#{name}@quill.org")
  end
end

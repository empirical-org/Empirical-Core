# frozen_string_literal: true

namespace :migrate_flag_to_flags do
  desc 'move flag user attribute to flags array user attribute'
  task :run => :environment do
   if User.column_names.include?('flag') && User.column_names.include?('flags')
     puts 'about to update flag to flags'
     User.where.not(flag: nil).each {|u| u.update(flags: [u.flag])}
     puts 'update completed'
   else
     puts 'flag or flags is not a column on the User model'
   end
 end
end

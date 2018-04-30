namespace :migrate_flag_to_flags do
  desc 'move flag user attribute to flags array user attribute'
  task :run => :environment do
    User.where.not(flag: nil).each {|u| u.update(flags: [u.flag])}
 end
end

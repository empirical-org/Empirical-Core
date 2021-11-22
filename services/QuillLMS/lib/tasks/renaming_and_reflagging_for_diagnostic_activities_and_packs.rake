namespace :diagnostic_activities_and_packs do
  desc 'Update diagnostic and diagnostic activity pack names and flags'
  task :rename_and_reflag => :environment do
    activity_pack_table = CSV.parse(File.read("lib/data/activity_pack_renaming_and_reflagging.csv"), headers: true)
    ActiveRecord::Base.transaction do
      activity_pack_table.each do |row|
        begin
          activity_pack = UnitTemplate.find_or_initialize_by(id: row["ID"])
          activity_pack.update!(name: row["Name"], flag: row["Flag"].downcase)
        rescue => e
          puts "ID:#{row['ID']}: #{e}"
        end
      end
    end
    activity_table = CSV.parse(File.read("lib/data/activity_renaming_and_reflagging.csv"), headers: true)
    ActiveRecord::Base.transaction do
      activity_table.each do |row|
        begin
          activity = Activity.find_or_initialize_by(id: row["ID"])
          activity.update!(name: row["Name"], flag: row["Flag"].downcase)
        rescue => e
          puts "ID:#{row['ID']}: #{e}"
        end
      end
    end
  end
end

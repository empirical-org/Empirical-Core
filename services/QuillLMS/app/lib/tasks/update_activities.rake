namespace :activities do
  desc 'Update activity descriptions and instructions'
  task :update => :environment do
    descriptions_table = CSV.parse(File.read("lib/data/activity_descriptions.csv"), headers: true)
    descriptions_table.each do |row|
      begin
        activity = Activity.find(row["ID"])
        description = row["Revised Activity Description"]
        activity.update!(description: description)
      rescue => e
        puts "ID:#{row['ID']}: #{e}"
      end
    end
    instructions_table = CSV.parse(File.read("lib/data/activity_instructions.csv"), headers: true)
    instructions_table.each do |row|
      begin
        activity = Activity.find(row["ID"])
        instructions = row["Instructions"]
        data = activity.data
        data["instructions"] = instructions
        activity.update!(data: data)
      rescue => e
        puts "ID:#{row['ID']}: #{e}"
      end
    end
  end
end

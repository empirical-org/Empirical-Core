require 'csv'

namespace :flags do 
  namespace :users do 
    desc 'Update User.flags from a CSV file'
    task :update_from_csv, [:filepath] => :environment do |t, args|
      iostream = File.open(args[:filepath], 'r').read
      if (CSV.parse(iostream, headers: true).headers & ["email", "flag"]).count != 2 
        puts "Invalid headers. Exiting."
        exit 1
      end 
      
      CSV.parse(iostream, headers: true) do |row|
          user = User.find_by_email(row['email'])
          if user.nil?
            puts "Unable to locate user with email #{row['email']}"
            next 
          end

          next if user.flags.include?(row['flag'])
          user.flags.append(row['flag'])
          user.save!
      end
    end

  end
end

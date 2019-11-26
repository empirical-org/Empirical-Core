namespace :firebase do
  desc "Import data from Firebase into a Rails model"
  task :import_data, [:firebase_url, :model, :column_data] => :environment do |_, args|
    include FirebaseTaskHelpers

    set_arg_values(args)

    for_each_firebase_key do |obj, data|
      obj.assign_attributes(data)
      obj.save!
    end
  end

  task :import_as_blob, [:firebase_url, :model, :column_data] => :environment do |_, args|
    include FirebaseTaskHelpers

    set_arg_values(args)

    file = File.open("collisions.txt", "w")
    for_each_firebase_key do |obj, data|
      obj.data = data
      begin
        obj.save!
      rescue ActiveRecord::RecordInvalid => e
        puts e
        file.puts obj.uid
        puts obj.uid
      end
    end
    file.close
  end

  module FirebaseTaskHelpers
    def get_klass(model_name)
      model_name.constantize
    rescue NameError
      puts("'#{@RAILS_MODEL}' does not seem to be a defined model.")
      exit
    end

    def fetch_firebase_data(url)
      uri = URI(url)
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      resp = http.get(uri)
      JSON.parse(resp.body)
    end

    def copy_firebase_key(base_url, key, klass)
    end

    def set_arg_values(args)
      @FIREBASE_URL = args[:firebase_url]
      @RAILS_MODEL = args[:model]
      column_parts = args[:column_data].split(":")
      @COLUMN_NAME = column_parts[0]
      @COLUMN_VAL = column_parts[1]
      if !@FIREBASE_URL || !@RAILS_MODEL
        puts('You must provide Firebase URL and Rails model args to run this task.')
        puts('Optional args:')
        puts('  column_name:<value>   the column name and value you wish to set for each imported entry')
        puts('Example usage:')
        puts('  rake firebase:import_data[https://quillconnect.firebaseio.com/v2/diagnostic_questions,Question,question_type:2]')
        exit
      end
    end

    def for_each_firebase_key
      klass = get_klass(@RAILS_MODEL)
      firebase_shallow = fetch_firebase_data("#{@FIREBASE_URL}.json?shallow=true")
      firebase_keys = firebase_shallow.keys
      firebase_keys.each do |key|
        data = fetch_firebase_data("#{@FIREBASE_URL}/#{key}.json")
        obj = klass.find_or_create_by(uid: key, "#{@COLUMN_NAME}": @COLUMN_VAL.to_s)
        if obj.valid?
          puts("updating #{@RAILS_MODEL} with uid '#{key}' and '#{@COLUMN_NAME}': #{@COLUMN_VAL}")
        else
          puts("creating #{@RAILS_MODEL} with uid '#{key}' and '#{@COLUMN_NAME}': #{@COLUMN_VAL}")
        end
        yield(obj, data)
      end
    end
  end
end

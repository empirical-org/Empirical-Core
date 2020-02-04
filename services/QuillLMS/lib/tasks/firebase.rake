namespace :firebase do
  desc "Import data from Firebase into a Rails model"
  task :import_data, [:firebase_url, :model] => :environment do |_, args|
    include FirebaseTaskHelpers

    set_arg_values(args)

    for_each_firebase_key do |obj, data|
      obj.assign_attributes(data)
      obj.save!
    end
  end

  task :import_as_blob, [:firebase_url, :model] => :environment do |_, args|
    include FirebaseTaskHelpers

    set_arg_values(args)

    for_each_firebase_key do |obj, data|
      obj.data = data
      begin
        obj.save!
      rescue ActiveRecord::RecordInvalid => e
        puts e
        puts obj.uid
      end
    end
  end

  task :import_as_blob_diagnostic_q, [:firebase_url, :model] => :environment do |_, args|
    include FirebaseTaskHelpers

    set_arg_values(args)

    for_each_firebase_diagnostic_key do |obj, data|
      obj.data = data
      obj.save!
    end
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
      if !@FIREBASE_URL || !@RAILS_MODEL
        puts('You must provide Firebase URL and Rails model args to run this task.')
        puts('Example usage:')
        puts('  rake firebase:import_data[https://quillconnect.firebaseio.com/v2/diagnostic_questions,Question]')
        exit
      end
    end

    def for_each_firebase_key
      klass = get_klass(@RAILS_MODEL)
      firebase_shallow = fetch_firebase_data("#{@FIREBASE_URL}.json?shallow=true")
      firebase_keys = firebase_shallow.keys
      firebase_keys.each do |key|
        data = fetch_firebase_data("#{@FIREBASE_URL}/#{key}.json")
        obj = klass.find_or_create_by(uid: key)
        if obj.valid?
          puts("updating #{@RAILS_MODEL} with uid '#{key}'")
        else
          puts("creating #{@RAILS_MODEL} with uid '#{key}'")
        end
        yield(obj, data)
      end
    end

    def copy_duplicate_diagnostic_question(obj)
      key = obj.uid
      delete_diagnostic_copy = [
        '-sen-fra',
        '-KPt2OD4fkKen27eyiry',
        '-KQS5LBNknrMg6dnURbH'
      ]

      if delete_diagnostic_copy.include? key
        # simulates a deletion (data does not get copied over)
        puts "DUPLICATE: omitting diagnostic copy of #{key}"
        obj = nil
      else
        puts "DUPLICATE: deleting connect copy and replacing with diagnostic copy of #{obj.uid}"
        prev_obj = Question.find_or_create_by(uid: key)
        prev_obj.delete
        obj
      end
    end

    def for_each_firebase_diagnostic_key
      firebase_shallow = fetch_firebase_data("#{@FIREBASE_URL}.json?shallow=true")
      firebase_keys = firebase_shallow.keys
      firebase_keys.each do |key|
        data = fetch_firebase_data("#{@FIREBASE_URL}/#{key}.json")
        obj = Question.find_or_create_by(uid: key, question_type: "diagnostic_sentence_combining")
        if Question.exists?(uid: key, question_type: "connect_sentence_combining")
          obj = copy_duplicate_diagnostic_question(obj)
        else
          puts("creating Question with uid '#{key}' and question_type: diagnostic_sentence_combining")
        end
        if obj.present?
          yield(obj, data)
        end
      end
    end
  end
end

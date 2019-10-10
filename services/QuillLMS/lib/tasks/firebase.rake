namespace :firebase do
  desc "Import data from Firebase into a Rails model"
  task :import_data, [:firebase_url, :model] => :environment do |_, args|
    include FirebaseTaskHelpers

    FIREBASE_URL = args[:firebase_url]
    RAILS_MODEL = args[:model]
    if !FIREBASE_URL || !RAILS_MODEL
      puts('You must provide Firebase URL and Rails model args to run this task.')
      puts('Example usage:')
      puts('  rake firebase:import_data[https://quillconnect.firebaseio.com/v2/titleCards,TitleCard]')
      exit
    end

    klass = get_klass(RAILS_MODEL)
    firebase_shallow = fetch_firebase_data("#{FIREBASE_URL}.json?shallow=true")
    firebase_keys = firebase_shallow.keys
    firebase_keys.each do |key|
      copy_firebase_key(FIREBASE_URL, key, klass)
    end
  end

  module FirebaseTaskHelpers
    def get_klass(model_name)
      return model_name.constantize
    rescue NameError
      puts("'#{RAILS_MODEL}' does not seem to be a defined model.")
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
      data = fetch_firebase_data("#{base_url}/#{key}.json")
      obj = klass.find_or_create_by(uid: key)
      if obj.valid?
        puts("updating #{RAILS_MODEL} with uid '#{key}'")
      else
        puts("creating #{RAILS_MODEL} with uid '#{key}'")
      end
      obj.assign_attributes(data)
      obj.save!
    end
  end
end

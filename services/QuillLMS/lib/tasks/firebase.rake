namespace :firebase do
  desc "Import data from Firebase into a Rails model"
  task :import_data, [:firebase_url, :model] => :environment do |_, args|
    FIREBASE_URL = args[:firebase_url]
    RAILS_MODEL = args[:model]
    if !FIREBASE_URL || !RAILS_MODEL
      puts('You must provide Firebase URL and Rails model args to run this task.')
      puts('Example usage:')
      puts('  rake firebase:import_data[https://quillconnect.firebaseio.com/v2/titleCards,TitleCard]')
      exit
    end
    begin
      klass = RAILS_MODEL.constantize
    rescue NameError
      puts("'#{RAILS_MODEL}' does not seem to be a defined model.")
      exit
    end
    uri = URI("#{FIREBASE_URL}.json?shallow=true")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    puts("Loading keys for #{FIREBASE_URL}")
    resp = http.get(uri)
    results = JSON.parse(resp.body)
    puts("All keys loaded")
    results.keys.each do |key|
      uri = URI("#{FIREBASE_URL}/#{key}.json")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      resp = http.get(uri)
      data = JSON.parse(resp.body)
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

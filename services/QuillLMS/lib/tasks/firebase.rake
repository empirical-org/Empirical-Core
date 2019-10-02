namespace :firebase do
  desc "Import data from Firebase into a Rails model"
  task import_data: :environment do
    FIREBASE_URL = ENV['FIREBASE_ROOT_URL']
    RAILS_MODEL = ENV['RAILS_MODEL']
    if not FIREBASE_URL or not RAILS_MODEL
      puts 'You must provide a FIREBASE_ROOT_URL and RAILS_MODEL ENV value to run this task.'
      puts 'Example usage:'
      puts '  rake firebase:import_data FIREBASE_ROOT_URL=https://quillconnect.firebaseio.com/v2/titleCards RAILS_MODEL=TitleCard'
      exit
    end
    klass = RAILS_MODEL.constantize
    uri = URI("#{FIREBASE_URL}.json?shallow=true")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    puts "Loading keys for #{FIREBASE_URL}"
    resp = http.get uri
    results = JSON.parse(resp.body)
    puts "All keys loaded"
    results.keys.each do |key|
      puts "Retrieving uid #{key}"
      uri = URI("#{FIREBASE_URL}/#{key}.json")
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      resp = http.get uri
      data = JSON.parse(resp.body)
      data.update({uid: key})
      begin
        klass.create(data)
        puts "...created #{RAILS_MODEL} with uid #{key}"
      rescue ActiveRecord::RecordNotUnique
        item = klass.find_by(uid: key)
        item.update(data)
        puts "...updated #{RAILS_MODEL} with uid #{key}"
      end
    end
  end

end

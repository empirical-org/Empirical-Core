namespace :dev do

  desc "easy tool to make this work locally with oauth apps"
  task :reset_apps => :environment do

    Doorkeeper::Application.all.each  { |app| switch_to_local(app, ['redirect_uri']) }
    ActivityClassification.all.each { |app| switch_to_local(app, ['form_url', 'module_url']) }

    puts "Replaced existing OAuth endpoints and app with localhost:4000 choices -- remember to run grammar there"

  end


  def switch_to_local(app, keys)

    keys.each do |key|
      rd_uri = URI.parse(app.send(key))
      if Rails.env.development?
        rd_uri.host = "localhost"
        rd_uri.port = 4000
      elsif Rails.env.staging?
        rd_uri.host = 'grammar.staging.quill.org'
      end

      app.send("#{key}=", rd_uri.to_s)
    end

    app.save
  end
end

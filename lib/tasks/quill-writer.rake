namespace :quillwriter do

  desc "create initial activities for writer"
  task :bootstrap => :environment do

    # classification
    ac = ActivityClassification.where(key: 'writer').first_or_create!
    ac.update_attributes(name: 'Quill Writer', key: 'writer', app_name: :writer,
                   module_url: 'http://quill-writer.firebaseapp.com/',
                     form_url: 'http://quill-writer.firebaseapp.com/?form=true')


    # taxonomy
    # CAUTION: Creating a section fails if the db has 0 workbooks.
    section = Section.where(name: 'Quill Writer Activities').first_or_create!
    topic = Topic.where(name: 'Quill Writer Topics', section_id: section.id).first_or_create!

    # topic info
    puts "\n\n---- TAXONOMY ----\n"
    ap TopicSerializer.new(topic).as_json


    # activities
    data = JSON.parse(open(Rails.root.join('db/writer-stories.json')).read)

    # remove all activies before
    topic.activities.delete_all

    puts "\n---- ACTIVITIES -----\n\n"

    data.values.each do |act|

      payload = {wordList: act['wordList'].to_json, prompt: act['prompt'].to_json}

      a = topic.activities.create!(name: act['name'], description: act['description'], data: payload, classification: ac)

      ap a.as_json
    end

  end


end

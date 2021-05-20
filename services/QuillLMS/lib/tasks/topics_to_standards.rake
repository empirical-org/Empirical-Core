namespace :topics_to_standards do
  task :migrate_data => :environment do
    Section.all.each do |s|
      s_hash = s.attributes
      StandardLevel.create(s_hash)
    end
    ActiveRecord::Base.connection.reset_pk_sequence!('standard_levels')

    TopicCategory.all.each do |tc|
      tc_hash = tc.attributes
      StandardCategory.create(tc_hash)
    end
    ActiveRecord::Base.connection.reset_pk_sequence!('standard_categories')

    Topic.all.each do |t|
      t_hash = t.attributes
      t_hash['standard_level_id'] = t_hash['section_id']
      t_hash['standard_category_id'] = t_hash['topic_category_id']
      t_hash.delete('section_id')
      t_hash.delete('topic_category_id')
      Standard.create(t_hash)
    end
    ActiveRecord::Base.connection.reset_pk_sequence!('standards')

    Activity.all.each do |a|
      begin
        a.update(standard_id: a.topic_id)
      rescue
        puts 'a.name', a.name
      end
    end
  end
end

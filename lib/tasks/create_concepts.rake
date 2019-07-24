namespace :concepts do
  desc 'import concepts from Google Spreadsheet csv'
  task :import_from_csv => :environment do
    file = Rails.root.join('db', 'data', 'Quill Concepts Levels - Sheet1.csv')
    CSV.foreach(file, headers: true) do |row|
      level_2_name = row['Concept_Level_2']
      level_1_name = row['Concept_Level_1']
      level_0_name = row['Concept_Level_0']
      if level_2_name.present? and level_1_name.present? and level_0_name.present?
        level_2_concept = Concept.find_or_create_by!(name: level_2_name)
        ap level_2_concept
        level_1_concept = Concept.find_or_create_by!(name: level_1_name,
                                                     parent_id: level_2_concept.id)
        ap level_1_concept
        level_0_concept = Concept.find_or_create_by!(name: level_0_name,
                                                     parent_id: level_1_concept.id)
        ap level_0_concept
      end
    end
  end
end
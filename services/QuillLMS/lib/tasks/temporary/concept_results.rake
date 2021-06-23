namespace :concept_results do
  task :update_metadata_strings_to_json, [:id] => [:environment] do |task, args|
    concept_results = ConceptResult.where("id >= ? AND question_type = 'lessons-slide'", args[:id])

    puts "Going to check #{concept_results.count} concept results"
    num_updates = 0

    ActiveRecord::Base.transaction do
      concept_results.each do |concept_result|
        metadata = concept_result.metadata

        next unless metadata.is_a?(String)

        concept_result.update(metadata: JSON.parse(metadata))
        num_updates += 1
        print '.'
      end
    end

    puts "\nUpdated #{num_updates} concept results' metadata"
  end
end
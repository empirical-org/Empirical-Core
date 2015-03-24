namespace :concept_tags do
  desc "Seed the default set of concept tags and categories"
  task :seed => :environment do
    default_list = {
      "Typing Speed" => [
        "Typing Speed"
      ],
      "Grammar Concepts" => [],
      "Punctuation Concepts" => [],
      "Two Player Student Writing" => [
        "Quill Writer Story"
      ]
    }

    default_list.each do |category_name, tag_list|
      category = ConceptClass.where(name: category_name).first_or_create!
      tag_list.each do |tag_name|
        ConceptTag.where(name: tag_name, concept_class: category).first_or_create!
      end
    end
  end

  namespace :seed do
    desc 'Import concept tags for Quill Grammar'
    task :grammar_concepts =>:environment do
      ConceptTagImporter.new.import_grammar_concepts
    end
  end
end
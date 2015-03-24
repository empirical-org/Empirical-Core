require 'csv'

class ConceptTagImporter

  # WARNING: These headers will need to be adjusted if the
  # format of the CSV changes. This is currently based off
  # a google doc entitled "Quill Grammar with Concept Tags"
  # dated 3/3/15.
  FILE_HEADERS = [
    :concept_tag,
    :concept_category
  ]

  GRAMMAR_CONCEPTS_CLASS = 'Grammar Concepts'

  def import_grammar_concepts
    file = Rails.root.join('db', 'grammar-concepts.csv')
    concept_class = ConceptClass.where('lower(name) = ?', GRAMMAR_CONCEPTS_CLASS.downcase)
      .first_or_create!(name: GRAMMAR_CONCEPTS_CLASS)

    tags = []
    categories = []
    CSV.foreach(file, headers: FILE_HEADERS) do |row|
      concept_tag_name = row[:concept_tag]
      if concept_tag_name.present?
        tags << ConceptTag.where('lower(name) = ?', concept_tag_name.downcase)
          .first_or_create!(name: concept_tag_name, concept_class_id: concept_class.id)
      end
      concept_category_name = row[:concept_category]
      if concept_category_name.present?
        categories << ConceptCategory.where('lower(name) = ?', concept_category_name.downcase)
          .first_or_create!(name: concept_category_name, concept_class_id: concept_class.id)
      end
    end
    msg = "Imported #{tags.size} concept tags and #{categories.size} concept categories"
    Rails.logger.info msg
    puts msg
  end
end
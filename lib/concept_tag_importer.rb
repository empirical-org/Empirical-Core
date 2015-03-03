require 'csv'

class ConceptTagImporter

  # WARNING: These headers will need to be adjusted if the
  # format of the CSV changes. This is currently based off
  # a google doc entitled "Quill Grammar with Concept Tags"
  # dated 3/3/15.
  FILE_HEADERS = [
    :answer,
    :concept_tag,
    :rule_name,
    :rule_question,
    :needs_work,
    :concept_category,
    :concept_class
  ]

  # Returns [concept_tags, concept_categories, concept_classes]
  def import_from_file(file)
    concept_tags = []
    concept_categories = []
    concept_classes = []
    CSV.parse(file, headers: FILE_HEADERS) do |row|
      row_props = row.to_hash
      # There should be only 1 concept class in this document.
      concept_class = ConceptClass.find_by(name: row[:concept_class])
      concept_tag = ConceptTag.find_or_create_by(name: row[:concept_tag], concept_class: concept_class)
      concept_category = ConceptCategory.find_or_create_by(name: row[:concept_category], concept_class: concept_class)

      concept_classes << concept_class
      concept_tags << concept_tag
      concept_categories << concept_category
    end
    [concept_tags.uniq, concept_categories.uniq, concept_classes.uniq]
  end
end
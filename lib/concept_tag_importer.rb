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
      concept_class_name = row[:concept_class]
      concept_class_name[0] = concept_class_name[0].capitalize
      concept_class = ConceptClass.where('lower(name) = ?', concept_class_name.downcase)
        .first_or_create(name: concept_class_name)

      # Name is case-insensitive
      concept_tag_name = row[:concept_tag]
      # Name is capitalized
      concept_tag_name[0] = concept_tag_name[0].capitalize
      concept_tag = ConceptTag.where('lower(name) = ?', concept_tag_name.downcase)
        .first_or_create(name: concept_tag_name, concept_class_id: concept_class.id)

      concept_category_name = row[:concept_category]
      concept_category_name[0] = concept_category_name[0].capitalize
      concept_category = ConceptCategory.where('lower(name) = ?', concept_category_name.downcase)
        .first_or_create(name: concept_category_name, concept_class_id: concept_class.id)

      concept_classes << concept_class
      concept_tags << concept_tag
      concept_categories << concept_category
    end
    [concept_tags.uniq, concept_categories.uniq, concept_classes.uniq]
  end
end
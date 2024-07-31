# frozen_string_literal: true

module TranslatableQuestion
  extend ActiveSupport::Concern
  include HTTParty
  include Translatable
  INCORRECT_SEQUENCES = 'incorrectSequences'
  FOCUS_POINTS = 'focusPoints'
  CMS_RESPONSES = 'cms_responses'

  def create_translation_mappings
    super
    [INCORRECT_SEQUENCES, FOCUS_POINTS, CMS_RESPONSES].each do |type|
      create_data_translation_mappings(type:)
    end
  end

  def translated_data(locale:)
    data = { default_translatable_field => translation(locale:) }
    [INCORRECT_SEQUENCES, FOCUS_POINTS, CMS_RESPONSES].reduce(data) do |acc, type|
      acc.merge(type => translations_for_prefix(type, locale: locale))
    end
  end

  private def translations_for_prefix(prefix, locale:)
    translated_texts
      .joins(english_text: :translation_mappings)
      .where(translation_mappings: { source: self })
      .where("translation_mappings.field_name LIKE ?", "#{prefix}%")
      .where(locale: locale)
      .pluck('translation_mappings.field_name', :translation)
      .to_h
  end

  private def create_data_translation_mappings(type:)
    data_for_translation_mappings[type].each do |field_name, translatable_text|
      create_translation_mappings_with_text(field_name:, translatable_text:)
    end
  end

  private def data_for_translation_mappings
    {
      CMS_RESPONSES => cms_responses,
      INCORRECT_SEQUENCES => translatable_data(type: INCORRECT_SEQUENCES),
      FOCUS_POINTS => translatable_data(type: FOCUS_POINTS),
    }
  end

  private def cms_responses
    response_body = JSON.parse(cms_data.body)

    transform_translatable_array(response_body, CMS_RESPONSES, 'id')
  end

  private def cms_url = "#{ENV['CMS_URL']}/questions/#{uid}/responses"
  private def cms_data = @cms_data ||= HTTParty.get(cms_url)

  private def translatable_data(type:)
    if stored_as_array?(type)
      translatable_for_array(type)
    else
      translatable_for_hash(type)
    end
  end

  private def translatable_for_hash(type)
    data[type]&.transform_values { |v| v['feedback'] }
      &.compact
      &.transform_keys { |k| "#{type}.#{k}" } || {}
  end

  private def translatable_for_array(type)
    transform_translatable_array(data[type], type, 'uid')
  end

  private def transform_translatable_array(array, key, id)
    array.each_with_object({}) do |item, hash|
      hash["#{key}.#{item[id]}"] = item['feedback']
    end
  end
end

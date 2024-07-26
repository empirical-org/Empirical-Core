# frozen_string_literal: true

module Translatable
  extend ActiveSupport::Concern

  SPANISH_LOCALE = 'es-la'
  DEFAULT_LOCALE = SPANISH_LOCALE
  GENGO_SOURCE = 'gengo'
  OPEN_AI_SOURCE = 'open_ai'
  SOURCES = [OPEN_AI_SOURCE, GENGO_SOURCE]

  included do
    has_many :translation_mappings, as: :source
    has_many :english_texts, through: :translation_mappings
    has_many :translated_texts, through: :english_texts
    has_many :gengo_jobs, through: :english_texts

    class_attribute :default_translatable_field, default: nil
  end

  def create_translation_mappings
    create_translation_mappings_with_text(translatable_text:)
  end

  def create_translation_mappings_with_text(translatable_text:, field_name: default_translatable_field)
    return unless translatable_text.is_a?(String) && translatable_text.present?
    return unless translation_mappings.where(field_name:).empty?

    english_text = EnglishText.find_or_create_by(text: translatable_text)
    translation_mappings.create(english_text:, field_name:)
  end

  def translation(locale: DEFAULT_LOCALE, source_api: OPEN_AI_SOURCE)
    @translation ||= translations(locale: locale, source_api: source_api)&.first&.translation
  end

  def translations(locale:, source_api:)
    translated_texts.where(locale: locale).ordered_by_source_api(source_api)
  end

  def translate!(locale: DEFAULT_LOCALE, source_api: OPEN_AI_SOURCE, force: false)
    create_translation_mappings
    case source_api
    when GENGO_SOURCE
      Gengo::RequestTranslations.run(english_texts, locale)
    when OPEN_AI_SOURCE
      texts = force ? english_texts : english_texts.reject { |e| e.translated?(locale:) }
      texts.each{ |text| OpenAI::TranslateAndSaveText.run(text, prompt: open_ai_prompt(locale:), locale:) }
    end
    translation(locale:, source_api:)
  end

  def fetch_translations!
    gengo_jobs.each(&:fetch_translation!)
  end

  def open_ai_prompt(locale:)
    "#{prompt_start(locale:)}#{custom_prompt}#{examples}\n text to translate: "
  end

  private def custom_prompt
    config_yaml['custom_prompt']
  end

  private def config_filename = "#{self.class.name.underscore}.yml"
  private def config_file = Rails.root.join('app/models/translation_config', config_filename)
  private def config_yaml = YAML.load_file(config_file)

  private def prompt_start(locale:)
    <<~STRING
      You are going to do a translation from english to #{locale} using simple words and language at a 5th grade reading level. Use shorter words over longer if possible. The tone should be somewhat casual. Return just the translated text preserving (but not translating) the HTML.

      We are translating the instructions for an English-language grammar activity. The content of the activity itself is not translated.

    STRING
  end

  private def examples
    examples = config_yaml['examples']
    return '' unless examples.present?

    formatted_examples = "Examples: \n"
    examples.each_with_index do |example, index|
      formatted_examples += "#{index + 1}. English: \"#{example['english']}\"\n"
      formatted_examples += "   Spanish: \"#{example['spanish']}\"\n\n"
    end
    formatted_examples
  end

  private def translatable_text
    data[default_translatable_field]
  end
end

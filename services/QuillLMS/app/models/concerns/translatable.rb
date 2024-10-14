# frozen_string_literal: true

module Translatable
  extend ActiveSupport::Concern

  SPANISH_LOCALE = 'es-la'
  ENGLISH_LOCALE = 'en'
  CHINESE_LOCALE = 'zh-cn'
  HINDI_LOCALE = 'hi'
  FRENCH_LOCALE = 'fr'
  ARABIC_LOCALE = 'ar'
  RUSSIAN_LOCALE = 'ru'
  PORTUGUESE_LOCALE = 'pt-br'
  URDU_LOCALE = 'ur'
  GERMAN_LOCALE = 'de'
  JAPANESE_LOCALE = 'ja'
  KOREAN_LOCALE = 'ko'
  VIETNAMESE_LOCALE = 'vi'
  THAI_LOCALE = 'th'
  UKRAINIAN_LOCALE = 'uk'
  TAGALOG_LOCALE = 'tl'
  FILIPINO_LOCALE = 'fil'
  DARI_LOCALE = 'prs'

  LANGUAGE_CONSTANTS = JSON.parse(File.read(Rails.root.join('config/locales/languageConstants.json')))

  LOCALE_TO_LANGUAGE = {
    ENGLISH_LOCALE => LANGUAGE_CONSTANTS['ENGLISH'],
    CHINESE_LOCALE => LANGUAGE_CONSTANTS['CHINESE'],
    HINDI_LOCALE => LANGUAGE_CONSTANTS['HINDI'],
    SPANISH_LOCALE => LANGUAGE_CONSTANTS['SPANISH'],
    FRENCH_LOCALE => LANGUAGE_CONSTANTS['FRENCH'],
    ARABIC_LOCALE => LANGUAGE_CONSTANTS['ARABIC'],
    RUSSIAN_LOCALE => LANGUAGE_CONSTANTS['RUSSIAN'],
    PORTUGUESE_LOCALE => LANGUAGE_CONSTANTS['PORTUGUESE'],
    URDU_LOCALE => LANGUAGE_CONSTANTS['URDU'],
    GERMAN_LOCALE => LANGUAGE_CONSTANTS['GERMAN'],
    JAPANESE_LOCALE => LANGUAGE_CONSTANTS['JAPANESE'],
    KOREAN_LOCALE => LANGUAGE_CONSTANTS['KOREAN'],
    VIETNAMESE_LOCALE => LANGUAGE_CONSTANTS['VIETNAMESE'],
    THAI_LOCALE => LANGUAGE_CONSTANTS['THAI'],
    UKRAINIAN_LOCALE => LANGUAGE_CONSTANTS['UKRAINIAN'],
    TAGALOG_LOCALE => LANGUAGE_CONSTANTS['TAGALOG'],
    FILIPINO_LOCALE => LANGUAGE_CONSTANTS['TAGALOG'],
    DARI_LOCALE => LANGUAGE_CONSTANTS['DARI']
  }

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
    return unless translation_mappings.joins(:english_text)
      .where(field_name:)
      .where(english_text: { text: translatable_text })
      .empty?

    clean_deprecated_translations(translatable_text:, field_name:)

    english_text = EnglishText.find_or_create_by(text: translatable_text)
    translation_mappings.create(english_text:, field_name:)
  end

  def translation(locale: DEFAULT_LOCALE, source_api: OPEN_AI_SOURCE)
    @translation ||= translations(locale: locale, source_api: source_api)&.first&.translation
  end

  def translations(locale:, source_api:, field_name: default_translatable_field)
    translated_texts.joins(:translation_mappings)
      .where(translation_mappings: { field_name: })
      .where(locale: locale).ordered_by_source_api(source_api)
  end

  def translate!(locale: DEFAULT_LOCALE, source_api: OPEN_AI_SOURCE, force: false)
    create_translation_mappings
    case source_api
    when GENGO_SOURCE
      Gengo::RequestTranslations.run(english_texts, locale)
    when OPEN_AI_SOURCE
      texts = force ? english_texts : english_texts.reject { |e| e.translated?(locale:) }
      texts.each { |text| OpenAI::TranslateAndSaveText.run(text, prompt: open_ai_prompt(locale:), locale:) }
    end
    translation(locale:, source_api:)
  end

  def fetch_translations!
    gengo_jobs.each(&:fetch_translation!)
  end

  def open_ai_prompt(locale:)
    "#{TranslationPrompts.prompt_start(locale:)}#{custom_prompt}#{examples}\n text to translate: "
  end

  private def custom_prompt
    config_yaml['custom_prompt']
  end

  private def config_filename = "#{self.class.name.underscore}.yml"
  private def config_file = Rails.root.join('app/models/translation_config', config_filename)
  private def config_yaml = YAML.load_file(config_file)

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

  private def clean_deprecated_translations(translatable_text:, field_name:)
    translation_mappings.joins(:english_text)
      .where(field_name:)
      .where.not(english_text: { text: translatable_text })
      .destroy_all
  end
end

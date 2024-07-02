# app/models/concerns/translatable.rb
module Translatable
  extend ActiveSupport::Concern

  SPANISH_LOCALE = "es-la"
  DEFAULT_LOCALE = SPANISH_LOCALE
  GENGO_SOURCE = "gengo"
  OPEN_AI_SOURCE = "open_ai"
  SOURCES = [OPEN_AI_SOURCE, GENGO_SOURCE]

  included do
    has_many :translation_mappings, as: :source
    has_many :english_texts, through: :translation_mappings
    has_many :translated_texts, through: :english_texts
    has_many :gengo_jobs, through: :english_texts
    store_accessor :data, :description
  end

  def translated_json(options = {})
    source_api = options[:source_api] || TranslatedText::OPEN_AI_SOURCE
    translation_text = translation(source_api: source_api)
    return data unless translation_text.present?

    data.merge({"translated#{translatable_attribute.capitalize}" => translation_text})
  end

  def create_translation_mappings
    return if translatable_text.nil?
    return unless translation_mappings.empty?

    english_text = EnglishText.find_or_create_by(text: translatable_text)
    translation_mappings.create(english_text: english_text)
  end

  def translation(locale: DEFAULT_LOCALE, source_api: OPEN_AI_SOURCE)
    translations(locale: locale, source_api: source_api)&.first&.translation
  end

  def translations(locale:, source_api:)
    translated_texts.where(locale: locale).ordered_by_source_api(source_api)
  end

  def translate!(locale: DEFAULT_LOCALE, source_api: OPEN_AI_SOURCE)
    case source_api
    when GENGO_SOURCE
      Gengo::RequestTranslations.run(english_texts, locale)
    when OPEN_AI_SOURCE
      english_texts.each{ |text| OpenAI::TranslateAndSaveText.run(text, prompt:) }
    end
  end

  def fetch_translations!
    gengo_jobs.each(&:fetch_translation!)
  end

  def prompt
    raise NotImplementedError, "#{self.class} must implement the 'prompt' method"
  end

  private

  def translatable_text
    raise NotImplementedError, "#{self.class} must implement the 'translatable_text' method"
  end
end

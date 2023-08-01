# frozen_string_literal: true

Rails.autoloaders.each do |autoloader|
  autoloader.inflector = Zeitwerk::Inflector.new
  autoloader.inflector.inflect(
    'auto_ml' => 'AutoML',
    'html_tag_remover' => 'HTMLTagRemover',
    'open_ai' => 'OpenAI'
  )
end

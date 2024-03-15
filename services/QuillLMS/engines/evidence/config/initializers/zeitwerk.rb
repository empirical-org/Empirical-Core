# frozen_string_literal: true

Rails.autoloaders.each do |autoloader|
  autoloader.inflector = Zeitwerk::Inflector.new
  autoloader.inflector.inflect(
    'auto_ml' => 'AutoML',
    'gen_ai' => 'GenAI',
    'html_tag_remover' => 'HTMLTagRemover',
    'llm_config' => 'LLMConfig',
    'open_ai' => 'OpenAI',
    'vertex_ai' => 'VertexAI'
  )
end

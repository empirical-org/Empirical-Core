# frozen_string_literal: true

Rails.autoloaders.each do |autoloader|
  autoloader.inflector = Zeitwerk::Inflector.new
  autoloader.inflector.inflect(
    'auto_ml' => 'AutoML',
    'gen_ai' => 'GenAI',
    'html_tag_remover' => 'HTMLTagRemover',
    'llm_config' => 'LLMConfig',
    'llm_configs_controller' => 'LLMConfigsController',
    'llm_prompt' => 'LLMPrompt',
    'llm_prompt_builder' => 'LLMPromptBuilder',
    'llm_prompt_response_feedback' => 'LLMPromptResponseFeedback',
    'llm_prompt_template' => 'LLMPromptTemplate',
    'llm_prompt_templates_controller' => 'LLMPromptTemplatesController',
    'open_ai' => 'OpenAI',
    'vertex_ai' => 'VertexAI'
  )
end

# frozen_string_literal: true

Rails.autoloaders.each do |autoloader|
  autoloader.inflector = Zeitwerk::Inflector.new
  autoloader.inflector.inflect(
    'auto_ml' => 'AutoML',
    'gen_ai' => 'GenAI',
    'g_eval' => 'GEval',
    'g_eval_score' => 'GEvalScore',
    'g_eval_scores_fetcher_callback' => 'GEvalScoresFetcherCallback',
    'g_evals_controller' => 'GEvalsController',
    'html_tag_remover' => 'HTMLTagRemover',
    'llm' => 'LLM',
    'llm_assigned_status_resolver' => 'LLMAssignedStatusResolver',
    'llm_example' => 'LLMExample',
    'llm_feedback_resolver' => 'LLMFeedbackResolver',
    'llm_prompt' => 'LLMPrompt',
    'llm_prompts_controller' => 'LLMPromptsController',
    'llm_prompt_builder' => 'LLMPromptBuilder',
    'llm_prompt_guideline' => 'LLMPromptGuideline',
    'llm_prompt_prompt_example' => 'LLMPromptPromptExample',
    'llm_prompt_template' => 'LLMPromptTemplate',
    'llm_prompt_templates_controller' => 'LLMPromptTemplatesController',
    'llms' => 'LLMs',
    'llms_controller' => 'LLMsController',
    'malformed_json_fixer' => 'MalformedJSONFixer',
    'open_ai' => 'OpenAI',
    'vertex_ai' => 'VertexAI'
  )
end

# frozen_string_literal: true

Rails.autoloaders.each do |autoloader|
  autoloader.inflector = Zeitwerk::Inflector.new
  autoloader.inflector.inflect(
    'auto_ml' => 'AutoML',
    'concept_replacement_cms_worker' => 'ConceptReplacementCMSWorker',
    'concept_replacement_lms_worker' => 'ConceptReplacementLMSWorker',
    'ell_starter_diagnostic_email_job' => 'ELLStarterDiagnosticEmailJob',
    'gen_ai' => 'GenAI',
    'g_eval' => 'GEval',
    'g_evals_controller' => 'GEvalsController',
    'graphiql' => 'GraphiQL',
    'html_tag_remover' => 'HTMLTagRemover',
    'llm' => 'LLM',
    'llms' => 'LLMs',
    'llms_controller' => 'LLMsController',
    'llm_feedback' => 'LLMFeedback',
    'llm_prompt' => 'LLMPrompt',
    'llm_prompts_controller' => 'LLMPromptsController',
    'llm_prompt_builder' => 'LLMPromptBuilder',
    'llm_prompt_prompt_example' => 'LLMPromptPromptExample',
    'llm_prompt_template' => 'LLMPromptTemplate',
    'llm_prompt_templates_controller' => 'LLMPromptTemplatesController',
    'malformed_json_fixer' => 'MalformedJSONFixer',
    'open_ai' => 'OpenAI',
    'pusher_csv_export_completed' => 'PusherCSVExportCompleted',
    'report_demo_ap_creator' => 'ReportDemoAPCreator',
    'sso_request' => 'SSORequest',
    'staff_csv_uploader' => 'StaffCSVUploader',
    'vertex_ai' => 'VertexAI'
  )
end

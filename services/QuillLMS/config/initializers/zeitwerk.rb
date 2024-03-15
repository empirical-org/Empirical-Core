# frozen_string_literal: true

Rails.autoloaders.each do |autoloader|
  autoloader.inflector = Zeitwerk::Inflector.new
  autoloader.inflector.inflect(
    'auto_ml' => 'AutoML',
    'concept_replacement_cms_worker' => 'ConceptReplacementCMSWorker',
    'concept_replacement_lms_worker' => 'ConceptReplacementLMSWorker',
    'ell_starter_diagnostic_email_job' => 'ELLStarterDiagnosticEmailJob',
    'gen_ai' => 'GenAI',
    'graphiql' => 'GraphiQL',
    'html_tag_remover' => 'HTMLTagRemover',
    'llm_config' => 'LLMConfig',
    'llm_prompt' => 'LLMPrompt',
    'llm_prompt_template' => 'LLMPromptTemplate',
    'open_ai' => 'OpenAI',
    'pusher_csv_export_completed' => 'PusherCSVExportCompleted',
    'report_demo_ap_creator' => 'ReportDemoAPCreator',
    'sso_request' => 'SSORequest',
    'staff_csv_uploader' => 'StaffCSVUploader',
    'vertex_ai' => 'VertexAI'
  )
end

# frozen_string_literal: true

Rails.autoloaders.each do |autoloader|
  autoloader.inflector = Zeitwerk::Inflector.new
  autoloader.inflector.inflect(
    'auto_ml' => 'AutoML',
    'concept_replacement_cms_worker' => 'ConceptReplacementCMSWorker',
    'concept_replacement_lms_worker' => 'ConceptReplacementLMSWorker',
    'ell_starter_diagnostic_email_job' => 'ELLStarterDiagnosticEmailJob',
    'graphiql' => 'GraphiQL',
    'html_tag_remover' => 'HTMLTagRemover',
    'open_ai' => 'OpenAI',
    'pusher_csv_export_completed' => 'PusherCSVExportCompleted',
    'report_demo_ap_creator' => 'ReportDemoAPCreator',
    'sso_request' => 'SSORequest',
    'staff_csv_uploader' => 'StaffCSVUploader',
    'vertex_ai' => 'VertexAI'
  )
end

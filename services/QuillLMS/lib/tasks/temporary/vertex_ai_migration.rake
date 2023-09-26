# frozen_string_literal: true

namespace :vertex_ai  do
  desc 'Populate prompt endpoint and model IDs'
  task populate_prompt_endpoint_and_model_ids: :environment do
    pipe_data = $stdin.read unless $stdin.tty?

    rows_data = []

    endpoint_client = ::Google::Cloud::AIPlatform::V1::EndpointService::Client.new
    parent = "projects/#{ENV.fetch('VERTEX_AI_PROJECT_ID')}/locations/#{ENV.fetch('VERTEX_AI_LOCATION')}"

    CSV.parse(pipe_data, headers: true) do |row|
      row_data = row.to_h
      conjunction = row_data['Conjunction'].downcase
      evidence_activity_id = row_data['Activity ID']
      name = "automl_#{row['AutoML Dataset']}"
      link = row_data['CMS Link'] = "https://www.quill.org/cms/evidence#/activities/#{evidence_activity_id}}/semantic-labels/#{conjunction}"
      row_data['CMS Link title'] = row_data.delete('Link to CMS')
      row_data['Prompt ID'] = Evidence::Prompt.find_by(activity_id: evidence_activity_id, conjunction: conjunction).id
      model_id = row['Vertex Model ID']
      model_name = "projects/#{ENV.fetch('VERTEX_AI_PROJECT_ID')}/locations/#{ENV.fetch('VERTEX_AI_LOCATION')}/models/#{model_id}"
      endpoint = endpoint_client.list_endpoints(parent: parent).find { |e| e.display_name.start_with?(name) }
      row_data['Endpoint ID'] = endpoint&.name&.split('/')&.last
      model = endpoint&.deployed_models&.find { |m| endpoint.display_name == m.display_name && m.display_name.start_with?(name) }
      row_data['Model ID'] = model&.model&.split('/')&.last
      row_data['Name'] = endpoint&.display_name

      rows_data << row_data
    end

    CSV.open("vertex_output.csv", "wb") do |csv|
      csv << rows_data.first.keys

      rows_data.each do |row|
        csv << row.values
      end
    end
  end

  task backfill_evidence_automl_models: :environment do
    pipe_data = $stdin.read unless $stdin.tty?

    CSV.parse(pipe_data, headers: true) do |row|
      next if row['Model ID'].blank? || row['Endpoint ID'].blank? || row['Prompt ID'].blank? || row['Model ID'].blank? || row['Name'].blank?

      Evidence::AutomlModel.create!(
        endpoint_external_id: row['Endpoint ID'],
        model_external_id: row['Model ID'],
        name: row['Name'],
        notes: 'Initial Vertex Model',
        prompt_id: row['Prompt ID'],
        state: 'inactive'
      )
    end
  end
end
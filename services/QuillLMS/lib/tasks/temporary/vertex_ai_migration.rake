# frozen_string_literal: true

namespace :vertex_ai  do
  desc 'Populate prompt endpoint and model IDs (note these need to be run locally as files are not available on the server))'
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
      row_data['Labels'] = Evidence::VertexAI::ParamsBuilder.run(row_data['Name'])[:labels]&.join(',')
      rows_data << row_data
    end

    CSV.open("vertex_backfill.csv", "wb") do |csv|
      csv << rows_data.first.keys

      rows_data.each do |row|
        csv << row.values
      end
    end
  end

  desc 'Backfill evidence_automl_models (note these need to be run locally as files are not available on the server))'
  task backfill_evidence_automl_models: :environment do
    pipe_data = $stdin.read unless $stdin.tty?

    CSV.parse(pipe_data, headers: true) do |row|
      next if row['Model ID'].blank? || row['Endpoint ID'].blank? || row['Prompt ID'].blank? || row['Name'].blank? || row['Labels'].blank?

      model_id = ActiveRecord::Base.connection.quote(row['Model ID'])
      endpoint_id = ActiveRecord::Base.connection.quote(row['Endpoint ID'])
      name = ActiveRecord::Base.connection.quote(row['Name'])
      labels = ActiveRecord::Base.connection.quote("{#{row['Labels']}}")
      prompt_id = ActiveRecord::Base.connection.quote(row['Prompt ID'])

      ActiveRecord::Base.connection.execute(
        <<~SQL
          INSERT INTO "evidence_automl_models" (
            "model_external_id",
            "endpoint_external_id",
            "name",
            "labels",
            "prompt_id",
            "state",
            "notes",
            "created_at",
            "updated_at"
          ) VALUES (
            #{model_id},
            #{endpoint_id},
            #{name},
            #{labels},
            #{prompt_id},
            'inactive',
            'Initial Vertex Model',
            NOW(),
            NOW()
          )
        SQL
      )
    end
  end

  task add_missing_vertex_ai_labels: :environment do
    old_models = ActiveRecord::Base.connection.execute(
      <<-SQL
        SELECT
          prompt_id,
          name,
          labels
        FROM comprehension_automl_models
        WHERE state = 'active'
        AND array_length(labels, 1) > 10
        ORDER BY prompt_id
      SQL
    ).to_a

    ids = []

    old_models.each do |old_model|
      old_labels = old_model['labels'].tr('{}', '').split(',')
      new_model = Evidence::AutomlModel.find_by(state: 'active', prompt_id: old_model['prompt_id'])
      next if new_model.nil?

      p [new_model.id, new_model.labels.count, new_model.state]
      # bypass attr_readonly on labels
      Evidence::AutomlModel
        .where(id: new_model.id)
        .update_all(labels: old_labels)

      ids << new_model.id

      p [new_model.id, new_model.labels.count, new_model.state]
    end

    ids.each do |id|
      automl_model = Evidence::AutomlModel.find(id)
      p [automl_model.id, automl_model.state]
      automl_model.activate
      automl_model.reload
      p [automl_model.id, automl_model.state]
    end
  end
end
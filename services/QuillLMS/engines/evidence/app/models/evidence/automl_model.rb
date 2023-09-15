# frozen_string_literal: true

require 'google/cloud/ai_platform/v1'

module Evidence
  class AutomlModel < ApplicationRecord
    self.table_name = 'evidence_automl_models'

    include Evidence::ChangeLog

    MIN_LABELS_LENGTH = 1
    STATES = [
      STATE_ACTIVE = 'active',
      STATE_INACTIVE = 'inactive'
    ].freeze

    PREDICT_API_TIMEOUT = 5.0
    GOOGLE_PROJECT_ID = ENV['AUTOML_GOOGLE_PROJECT_ID']
    GOOGLE_PREDICTION_ENDPOINT_ID = ENV['AUTOML_GOOGLE_PREDICTION_ENDPOINT_ID']
    GOOGLE_LOCATION = ENV['AUTOML_GOOGLE_LOCATION']
    CONFUSION_MATRIX = 'confusionMatrix'
    ANNOTATION_SPECS = 'annotationSpecs'
    DISPLAY_NAME = 'displayName'

    attr_readonly :model_external_id, :endpoint_external_id, :name, :labels

    belongs_to :prompt, inverse_of: :automl_models

    validate :validate_label_associations, if: :active?

    validates :model_external_id, presence: true, uniqueness: true
    validates :endpoint_external_id, presence: true, uniqueness: true
    validates :labels, presence: true, length: {minimum: MIN_LABELS_LENGTH}
    validates :name, presence: true
    validates :state, inclusion: {in: ['active', 'inactive']}

    before_validation :strip_whitespace

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :model_external_id, :endpoint_external_id, :notes, :name, :labels, :state, :prompt_id, :created_at, :updated_at],
        methods: [:older_models]
      ))
    end

    def populate_from_model_external_id
      self.name = automl_name
      self.labels = automl_labels
      self.state = STATE_INACTIVE
    end

    def active?
      state == STATE_ACTIVE
    end

    # rubocop:disable Metrics/CyclomaticComplexity
    def activate
      AutomlModel.transaction do
        prompt.automl_models.update_all(state: STATE_INACTIVE)
        update!(state: STATE_ACTIVE)
        prompt_automl_rules.all.each do |rule|
          rule.update!(state: Rule::STATE_INACTIVE) unless labels.include?(rule.label&.name)
          rule.update!(state: Rule::STATE_ACTIVE) if labels.include?(rule.label&.name)
        end
      end
      log_activation
      self
    rescue => e
      raise e unless e.is_a?(ActiveRecord::RecordInvalid)

      return false
    end
    # rubocop:enable Metrics/CyclomaticComplexity

    def fetch_automl_label(text)
      instances = [Google::Protobuf::Value.new(struct_value: { fields: { content: { string_value: text } } })]

      results =
        automl_prediction_client
          .predict(endpoint: automl_prediction_endpoint, instances: instances)
          .predictions
          .first
          .struct_value
          .fields

      confidences = results['confidences'].list_value.values.map(&:number_value)
      score, score_index = confidences.each_with_index.max_by { |score, i| [score, i] }
      display_name = results['displayNames'].list_value.values[score_index].string_value
      [display_name, score]
    end

    def older_models
      @older_models ||= AutomlModel.where(prompt_id: prompt_id).where("created_at < ?", created_at).count
    end

    def change_log_name
      "AutoML Model"
    end

    def url
      "evidence/#/activities/#{prompt.activity.id}/semantic-labels/model/#{id}"
    end

    def evidence_name
      name
    end

    private def strip_whitespace
      self.model_external_id = model_external_id.strip unless model_external_id.nil?
      self.endpoint_external_id = endpoint_external_id.strip unless endpoint_external_id.nil?
    end

    private def prompt_automl_rules
      prompt.rules.where(rule_type: Rule::TYPE_AUTOML)
    end

    private def prompt_labels
      prompt_automl_rules.all.map { |r| r.label }
    end

    private def prompt_label_names
      prompt_labels.map { |l| l.name }
    end

    private def labels_have_associated_rules
      missing_labels = labels - prompt_label_names
      missing_labels == []
    end

    private def validate_label_associations
      return unless active?
      return if labels_have_associated_rules

      errors.add(:state, "can't be set to 'active' until all labels have a corresponding rule")
    end

    private def automl_client
      automl_client = ::Google::Cloud::AIPlatform::V1::ModelService::Client.new
    end

    private def automl_prediction_client
      @automl_prediction_client ||= ::Google::Cloud::AIPlatform::V1::PredictionService::Client.new do |config|
        config.timeout = PREDICT_API_TIMEOUT
      end
    end

    private def automl_model_path
      @automl_model_path ||= automl_client.model_path(**model_path_args)
    end

    private def model_path_args
      {project: GOOGLE_PROJECT_ID, location: GOOGLE_LOCATION, model: model_external_id.strip}
    end

    private def automl_prediction_endpoint
      "projects/#{GOOGLE_PROJECT_ID}/locations/#{GOOGLE_LOCATION}/endpoints/#{endpoint_external_id}"
    end

    private def automl_labels
      automl_client
        .list_model_evaluations(parent: automl_model_path)
        .first
        .to_h
        .dig(:metrics, :struct_value, :fields, CONFUSION_MATRIX, :struct_value, :fields, ANNOTATION_SPECS, :list_value, :values)
        .map { |v| v.dig(:struct_value, :fields, DISPLAY_NAME, :string_value) }
        .flatten
        .reject(&:empty?)
        .uniq
    end

    private def automl_name
      automl_client
        .get_model(name: automl_model_path)
        .display_name
    end

    private def log_activation
      log_change(@lms_user_id, :activate_automl, self, nil, nil, nil)
    end
  end
end

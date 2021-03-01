require "google/cloud/automl"


module Comprehension
  class AutomlModel < ActiveRecord::Base
    MIN_LABELS_LENGTH = 1
    STATES = [
      STATE_ACTIVE = 'active',
      STATE_INACTIVE = 'inactive'
    ]

    attr_readonly :automl_model_id, :name, :labels

    belongs_to :prompt, inverse_of: :automl_models

    validate :validate_label_associations, if: :active?

    validates :automl_model_id, presence: true, uniqueness: true
    validates :labels, presence: true, length: {minimum: 1}
    validates :name, presence: true
    validates :state, inclusion: {in: ['active', 'inactive']}

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :automl_model_id, :name, :labels, :state, :prompt_id]
      ))
    end

    def populate_from_automl_model_id
      self.name = automl_name
      self.labels = automl_labels
      self.state = STATE_INACTIVE
    end

    def active?
      state == STATE_ACTIVE
    end

    def activate
      self.state = STATE_ACTIVE
      if !valid?
        self.state = STATE_INACTIVE
        return false
      end

      active_model = prompt.automl_models.where(state: STATE_ACTIVE).first
      return self if active_model == self

      active_model.state = STATE_INACTIVE if active_model
      rules = prompt_automl_rules.all
      transaction_succeeded = true
      AutomlModel.transaction do
        begin
          active_model&.save!
          save!
          rules.each do |r|
            if labels.include?(r.label&.name)
              r.state = Rule::STATE_ACTIVE
            else
              r.state = Rule::STATE_INACTIVE
            end
            r.save!
          end
        rescue StandardError => e
          transaction_succeeded = false
          self.state = STATE_INACTIVE
          raise e unless e.is_a?(ActiveRecord::RecordInvalid)
        end
      end
      transaction_succeeded
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
      if state == STATE_ACTIVE && !labels_have_associated_rules
        errors.add(:state, "can't be set to 'active' until all labels have a corresponding rule")
      end
    end

    private def automl_client
      @automl_client ||= Google::Cloud::AutoML.auto_ml
    end

    private def automl_model_full_id
      @model_full_id ||= automl_client.model_path(project: ENV['AUTOML_GOOGLE_PROJECT_ID'], location: ENV['AUTOML_GOOGLE_LOCATION'], model: automl_model_id)
    end

    private def automl_labels
      evaluations = automl_client.list_model_evaluations(parent: automl_model_full_id)
      evaluations.map { |e| e.display_name }.reject { |l| l.empty? }
    end

    private def automl_name
      model = automl_client.get_model(name: automl_model_full_id)
      model.display_name
    end
  end
end

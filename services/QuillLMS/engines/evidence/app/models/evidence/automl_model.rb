# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_automl_models
#
#  id                   :bigint           not null, primary key
#  labels               :string           default([]), is an Array
#  name                 :string           not null
#  notes                :text             default("")
#  state                :string           not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  endpoint_external_id :string           not null
#  model_external_id    :string           not null
#  prompt_id            :bigint
#
# Indexes
#
#  index_evidence_automl_models_on_prompt_id  (prompt_id)
#
# Foreign Keys
#
#  fk_rails_...  (prompt_id => comprehension_prompts.id)
#

module Evidence
  class AutomlModel < ApplicationRecord
    self.table_name = 'evidence_automl_models'

    include Evidence::ChangeLog

    MIN_LABELS_LENGTH = 1

    STATES = [
      STATE_ACTIVE = 'active',
      STATE_INACTIVE = 'inactive'
    ].freeze

    attr_readonly :model_external_id, :endpoint_external_id, :name, :labels

    belongs_to :prompt, inverse_of: :automl_models

    validate :validate_label_associations, if: :active?

    validates :model_external_id, presence: true, uniqueness: true
    validates :endpoint_external_id, presence: true, uniqueness: true
    validates :labels, presence: true, length: {minimum: MIN_LABELS_LENGTH}
    validates :name, presence: true
    validates :state, inclusion: {in: STATES}

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :model_external_id, :endpoint_external_id, :notes, :name, :labels, :state, :prompt_id, :created_at, :updated_at],
        methods: [:older_models]
      ))
    end

    def assign_custom_attributes
      assign_attributes(VertexAI::ParamsBuilder.run(name).merge(state: STATE_INACTIVE))
    end

    def active?
      state == STATE_ACTIVE
    end

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
    rescue ActiveRecord::RecordInvalid => e
      false
    end

    def classify_text(text)
      VertexAI::TextClassifier.run(endpoint_external_id, text)
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

    private def prompt_automl_rules
      prompt.rules.where(rule_type: Rule::TYPE_AUTOML)
    end

    private def prompt_labels
      prompt_automl_rules.all.map(&:label)
    end

    private def prompt_label_names
      prompt_labels.map(&:name)
    end

    private def labels_have_associated_rules?
      (labels - prompt_label_names).empty?
    end

    private def validate_label_associations
      return unless active?
      return if labels_have_associated_rules?

      errors.add(:state, "can't be set to 'active' until all labels have a corresponding rule")
    end

    private def log_activation
      log_change(@lms_user_id, :activate_automl, self, nil, nil, nil)
    end
  end
end

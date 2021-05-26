module Comprehension
  class Label < ActiveRecord::Base
    include Comprehension::ChangeLog

    NAME_MIN_LENGTH = 3
    NAME_MAX_LENGTH = 50

    attr_readonly :name

    belongs_to :rule, inverse_of: :label

    validates :rule, presence: true, uniqueness: true
    validates :name, presence: true, length: {in: NAME_MIN_LENGTH..NAME_MAX_LENGTH}

    validate :name_unique_for_prompt, on: :create

    after_create :log_creation
    after_destroy :log_deletion
    after_update :log_update, if: :name_changed?

    def serializable_hash(options = nil)
      options ||= {}

      super(options.reverse_merge(
        only: [:id, :name, :rule_id]
      ))
    end

    private def name_unique_for_prompt
      prompt_labels = rule&.prompts&.first&.rules&.map { |r| r.label }
      if prompt_labels&.map { |l| l&.name }&.include?(name)
        errors.add(:name, "can't be the same as any other labels related to the same prompt")
      end
    end

    private def log_creation
      rule&.prompts&.each do |prompt|
        log_change(:create_semantic, prompt, nil, nil, nil, "#{rule.name} | #{name}")
      end
    end

    private def log_deletion
      rule&.prompts&.each do |prompt|
        log_change(:delete_semantic, prompt, nil, nil, "#{rule.name} | #{name}", "#{rule.name} | #{name}")
      end
    end

    private def log_update
      rule&.prompts&.each do |prompt|
        log_change(:update_semantic, prompt, nil, nil, "#{rule.name} | #{name_change[0]}", "#{rule.name} | #{name_change[1]}")
      end
    end
  end
end

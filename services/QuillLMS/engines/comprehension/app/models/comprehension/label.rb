module Comprehension
  class Label < ActiveRecord::Base
    NAME_MIN_LENGTH = 3
    NAME_MAX_LENGTH = 50

    attr_readonly :name

    belongs_to :rule, inverse_of: :label

    validates :rule, presence: true, uniqueness: true
    validates :name, presence: true, length: {in: NAME_MIN_LENGTH..NAME_MAX_LENGTH}

    validate :name_unique_for_prompt, on: :create

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
  end
end

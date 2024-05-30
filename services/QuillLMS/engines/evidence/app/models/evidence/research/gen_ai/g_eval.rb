# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_g_evals
#
#  id                  :bigint           not null, primary key
#  evaluation_criteria :text             not null
#  evaluation_steps    :text             not null
#  max_score           :integer          not null
#  metric              :string           not null
#  misc                :jsonb
#  selectable          :boolean          default(TRUE)
#  task_introduction   :text             not null
#  version             :integer          not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#
module Evidence
  module Research
    module GenAI
      class GEval < ApplicationRecord
        validates :task_introduction, presence: true
        validates :evaluation_criteria, presence: true
        validates :evaluation_steps, presence: true
        validates :metric, presence: true
        validates :max_score, presence: true
        validates :version, presence: true
        validates :selectable, inclusion: { in: [true, false] }

        attr_readonly :task_introduction,
          :evaluation_criteria,
          :evaluation_steps,
          :metric,
          :max_score,
          :version

        before_validation :set_version

        scope :selectable, -> { where(selectable: true) }

        def set_version
          existing_version = self.class.where(metric: metric).order(version: :desc).first&.version
          self.version = existing_version.is_a?(Integer) ? existing_version + 1 : 1
        end

        def name = "#{metric} v#{version}"

        def to_s = name
      end
    end
  end
end

# == Schema Information
#
# Table name: prompt_healths
#
#  id                           :integer          not null, primary key
#  difficulty                   :float
#  flag                         :string
#  focus_points                 :integer
#  incorrect_sequences          :integer
#  percent_common_unmatched     :float
#  percent_reached_optimal      :float
#  percent_specified_algorithms :float
#  text                         :string
#  url                          :string
#  activity_health_id           :integer
#
# Foreign Keys
#
#  fk_rails_...  (activity_health_id => activity_healths.id) ON DELETE => cascade
#
class PromptHealth < ActiveRecord::Base
  FLAGS = %w(production archived alpha beta private)

  belongs_to :activity_health

  validates :flag, inclusion: { in: FLAGS, allow_nil: true}
  validates :incorrect_sequences, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
  validates :focus_points, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
  validates :percent_common_unmatched, inclusion: { in: 0..100, allow_nil: true }
  validates :percent_specified_algorithms, inclusion: { in: 0..100, allow_nil: true }
  validates :difficulty, inclusion: { in: 0..5, allow_nil: true }
  validates :percent_reached_optimal, inclusion: { in: 0..100, allow_nil: true }

  def serializable_hash(options = nil)
    options ||= {}

    super(options.reverse_merge(
      only: [:id, :text, :url, :flag, :incorrect_sequences,
             :focus_points, :percent_common_unmatched,
             :percent_specified_algorithms, :difficulty,
             :percent_reached_optimal]
    ))
  end
end

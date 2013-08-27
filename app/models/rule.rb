class Rule < ActiveRecord::Base
  belongs_to :category
  belongs_to :workbook
  validates :title, presence: true

  has_many :questions, class_name: 'RuleQuestion' do
    def unanswered score
      answered_ids = score.all_lesson_input.keys.map(&:to_i)
      return all if answered_ids.empty?
      where('id not in (?)', answered_ids)
    end
  end
end

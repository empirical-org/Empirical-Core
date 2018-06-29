class ResponseLabelTag < ApplicationRecord
  belongs_to :response
  belongs_to :response_label

  validates_presence_of :response, :response_label, :score
end

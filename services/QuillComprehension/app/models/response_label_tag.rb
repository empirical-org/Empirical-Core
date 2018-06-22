class ResponseLabelTag < ApplicationRecord
  belongs_to :response
  belongs_to :response_label
end

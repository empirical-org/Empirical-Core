class Story < Quill::ActivityModel
  attributes :name, :description, :body
  validates :name, presence: true
  validates :description, presence: true
end

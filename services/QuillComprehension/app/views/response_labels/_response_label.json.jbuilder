json.extract! response_label, :id, :name, :description, :created_at, :updated_at
json.url response_label_url(response_label, format: :json)

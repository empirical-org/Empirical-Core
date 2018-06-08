json.extract! response, :id, :question, :text, :created_at, :updated_at
json.url response_url(response, format: :json)

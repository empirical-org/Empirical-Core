class Types::MutationType < Types::BaseObject

  field :create_new_response, function: Mutations::CreateNewResponse.new

  field :create_response_label_tag, function: Mutations::CreateResponseLabelTag.new
end

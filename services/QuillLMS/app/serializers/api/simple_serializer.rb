# frozen_string_literal: true

class Api::SimpleSerializer < ActiveModel::Serializer
  attributes :uid, :name
end
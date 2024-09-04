# frozen_string_literal: true

class StaticController < ApplicationController
  def manifest
    manifest_path = Rails.root.join('config/manifest.json')
    send_file manifest_path, type: 'application/json', disposition: 'inline'
  end
end

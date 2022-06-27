# frozen_string_literal: true

class Cms::CmsController < ApplicationController
  before_action :staff!
end

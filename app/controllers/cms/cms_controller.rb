class Cms::CmsController < ApplicationController
  before_filter :staff!
end

class ApplicationController < ActionController::Base
  protect_from_forgery
  include Authentication
  helper CMS::Helper
end

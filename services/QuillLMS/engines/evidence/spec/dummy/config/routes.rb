Rails.application.routes.draw do

  mount Evidence::Engine => "/evidence", as: :evidence
end

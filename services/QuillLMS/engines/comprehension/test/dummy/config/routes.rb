Rails.application.routes.draw do

  mount Comprehension::Engine => "/comprehension", as: :comprehension
end

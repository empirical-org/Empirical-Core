class Author < ActiveRecord::Base
  has_many :unit_templates
  has_attached_file :avatar, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png"
end
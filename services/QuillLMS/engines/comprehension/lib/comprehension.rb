require "comprehension/engine"

module Comprehension
  mattr_accessor :parent_activity_class
  mattr_accessor :parent_activity_classification_class

  def self.parent_activity_class
    @@parent_activity_class.constantize
  end

  def self.parent_activity_classification_class
    @@parent_activity_classification_class.constantize
  end

end

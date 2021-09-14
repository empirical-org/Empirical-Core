require "evidence/engine"

module Evidence
  mattr_accessor :parent_activity_class
  mattr_accessor :parent_activity_classification_class
  mattr_accessor :change_log_class
  mattr_accessor :user_class

  def self.parent_activity_class
    @@parent_activity_class.constantize
  end

  def self.parent_activity_classname
    @@parent_activity_class
  end

  def self.parent_activity_classification_class
    @@parent_activity_classification_class.constantize
  end

  def self.change_log_class
    @@change_log_class.constantize
  end

  def self.user_class
    @@user_class.constantize
  end

end

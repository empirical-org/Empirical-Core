module CMS::Orderable
  extend ActiveSupport::Concern

  def order_scope
    if self.class.order_scope && (scoped = send(self.class.order_scope))
      scoped.send(self.class.model_name.collection)
    else
      self.class
    end
  end

  module ClassMethods
    def orderable name, options = {}
      default_scope { order(name) }
      after_save :"order_#{name}"
      if options[:order_scope] then order_scope(options[:order_scope]) end

      define_method :"order_#{name}" do
        order_scope.where("#{name} >= #{send(name)}").where("id != #{id}").select(:id).select(name).inject(send(name)) do |i, record|
          record.update_column name, (i += 1) ; i
        end

        order_scope.all.inject(1) do |i, record|
          record.update_column name, i ; i + 1
        end
      end
    end

    def order_scope scope = false
      if scope then @order_scope = scope else @order_scope end
    end
  end
end

class SectionSerializer < ActiveModel::Serializer
  attributes :id, :name, :created_at, :updated_at, :workbook

  def workbook
    object.workbook ? object.workbook : {}
  end
end

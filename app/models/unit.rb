class Unit < ActiveRecord::Base

  include CheckboxCallback

  belongs_to :classroom
  has_many :classroom_activities, dependent: :destroy
  has_many :activities, through: :classroom_activities
  has_many :topics, through: :activities
  default_scope { where(visible: true)}
  after_save :teacher_checkbox



  def teacher_checkbox

    if (self.classroom && self.classroom.teacher)
      if UnitTemplate.find_by_name(self.name)
        checkbox_name = 'Assign Featured Activity Pack'
      else
        checkbox_name = 'Build Your Own Activity Pack'
      end

      find_or_create_checkbox(checkbox_name, self.classroom.teacher)
    end
  end


end

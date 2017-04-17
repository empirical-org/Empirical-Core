namespace :create_unit_template_units do
  desc 'create unit template units based on existing unit templates and units'

  task :create => :environment do
    create_unit_template_units
  end

  def create_unit_template_units
    UnitTemplate.all.each do |ut|
      ut.name.slice(' | BETA')
      Unit.unscoped.where(name: ut.name).each do |u|
        if u.unit_template.nil?
          UnitTemplateUnit.create(unit_template_id: ut.id, unit_id: u.id)
        end
      end
    end
  end
end

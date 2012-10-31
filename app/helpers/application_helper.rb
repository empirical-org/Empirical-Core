module ApplicationHelper
  def form_for *args, &block
    options = args.extract_options!
    args << options.reverse_merge(builder: CMS::FormBuilder, format: 'html', html: {class: 'form-horizontal'})
    super *args, &block
  end
end

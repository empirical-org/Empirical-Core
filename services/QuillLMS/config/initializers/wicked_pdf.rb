# frozen_string_literal: true

WickedPdf.config = {
  enable_local_file_access: true,
  exe_path: Rails.env.local? ? Gem.bin_path('wkhtmltopdf-binary', 'wkhtmltopdf') : Gem.bin_path('wkhtmltopdf-heroku', 'wkhtmltopdf-linux-amd64'),
  no_pdf_compression: true
}

# frozen_string_literal: true

WICKED_PDF_EXE_PATH =
  if Rails.env.development? || Rails.env.test?
    Gem.bin_path('wkhtmltopdf-binary', 'wkhtmltopdf')
  else
    Gem.bin_path('wkhtmltopdf-heroku', 'wkhtmltopdf-linux-amd64')
  end

WickedPdf.config = {
  enable_local_file_access: true,
  exe_path: WICKED_PDF_EXE_PATH
}

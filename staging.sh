rm -r dist/; QUILL_CMS=https://cms.quill.org NODE_ENV=production EMPIRICAL_BASE_URL=https://www.quill.org webpack --optimize-minimize
firebase deploy --project production

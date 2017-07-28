rm -r dist/; QUILL_CMS=https://cms.quill.org NODE_ENV=production EMPIRICAL_BASE_URL=https://www.quill.org PUSHER_KEY=b2cbf247b2e2d930b21d webpack --optimize-minimize
firebase deploy --project production

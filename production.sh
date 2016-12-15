rm -r dist/; NODE_ENV=production EMPIRICAL_BASE_URL=https://www.quill.org webpack --optimize-minimize
firebase deploy --project production
./rollbar.sh

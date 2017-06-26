rm -r dist/; QUILL_CMS=https://cms.quill.org NODE_ENV=production EMPIRICAL_BASE_URL=https://www.quill.org webpack --optimize-minimize
firebase deploy --project production
aws s3 sync ./dist/ s3://aws-website-quillconnect-6sy4b
./rollbar.sh

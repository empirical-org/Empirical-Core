current_directory=`echo ${PWD##/} | awk -F"/" '{print $(NF-1)"/"$(NF);}'`
if [ "$current_directory" != "services/QuillLMS" ]
then
  echo "You must run the bootstrap script from the QuillLMS root directory."
  exit 1
fi

cd client
npm install eslint
npm install eslint-nibble
npx eslint-nibble --rule no:console --ext .js,.jsx .

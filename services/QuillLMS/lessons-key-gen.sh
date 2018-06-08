# Generate an rsa key to be used by the lessons server
ssh-keygen -t rsa -b 4096 -f ./rethink-key
perl -pi -e 's/\n/\\n/g' ./rethink-key
mv rethink-key.pub ../QuillLessonsServer/rethink-public-key.crt
echo LESSONS_PRIVATE_KEY=$(cat rethink-key) >> .env
rm rethink-key

pg_restore --verbose --clean --no-acl --no-owner -h 127.0.0.1 -d emp_gr_development snapshot.dump
rm snapshot.dump
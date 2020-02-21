curl -o golang.pkg https://dl.google.com/go/go1.13.3.darwin-amd64.pkg
open golang.pkg

echo "export GOROOT=/usr/local/go" >> ~/.profile
echo "export PATH=$GOROOT/bin:$PATH" >> ~/.profile

source ~/.profile

go get -u github.com/kardianos/govendor

from ubuntu:latest

run echo "Building Palpitate docker image"

run echo "Building..."
run apt-get update
run apt-get install -y nodejs
run apt-get install -y npm

run ln -s "$(which nodejs)" /usr/bin/node

run echo "Finished"

EXPOSE 8080

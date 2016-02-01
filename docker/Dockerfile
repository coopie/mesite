from ubuntu:latest

run echo "Building Palpitate docker image"

run echo "Building..."
run apt-get update
run apt-get install -y nodejs
run apt-get install -y npm

run ln -s "$(which nodejs)" /usr/bin/node


# Install haskell stack
#run apt-get install -y ghc
run apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 575159689BEFB442
run echo 'deb http://download.fpcomplete.com/ubuntu trusty main'|sudo tee /etc/apt/sources.list.d/fpco.list
run apt-get update && sudo apt-get install stack -y
run stack setup

run apt-get -y install wget
run apt-get -y install curl
run apt-get -y install unzip

# run apt-get -y install libghc-zeromq-haskell-dev
# add install_zeromq.sh /install_zeromq.sh
# run /bin/sh ./install_zeromq.sh
# run echo 'deb http://us.archive.ubuntu.com/ubuntu precise main universe' |sudo tee /etc/apt/sources.list.d/fpco.list
# run sudo apt-get update
# run sudo apt-get -y install libghc-zeromq-haskell-prof

run apt-get install -y libtool pkg-config build-essential autoconf automake
run apt-get install -y libzmq-dev

add install_sodium.sh /install_sodium.sh
add install_zeromq.sh /install_zeromq.sh

run /bin/sh install_sodium.sh

run /bin/sh install_zeromq.sh


run echo "Finished"

EXPOSE 8080

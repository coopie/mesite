VERSION=4.0.5 #4.1.4 #3.2.5

wget http://download.zeromq.org/zeromq-$VERSION.tar.gz &&
tar -xvf zeromq-$VERSION.tar.gz &&
cd zeromq-$VERSION &&
./autogen.sh &&
./configure &&
make -j6 &&
# make check &&
sudo make install &&
sudo ldconfig

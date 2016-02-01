# git clone git://github.com/jedisct1/libsodium.git &&
# curl https://codeload.github.com/jedisct1/libsodium/zip/master > libsodium-master.zip &&
# unzip libsodium-master.zip &&
# cd libsodium-master &&
# ./autogen.sh &&
# ./configure && make check &&
# sudo make install &&
# sudo ldconfig


wget https://download.libsodium.org/libsodium/releases/libsodium-1.0.3.tar.gz &&
tar xzvf libsodium-1.0.3.tar.gz &&
cd libsodium-1.0.3/ &&
./autogen.sh &&
./configure && make check &&
sudo make install

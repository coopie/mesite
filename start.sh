CURRENT=`pwd`
if [ "$1" = "bash" ]
    then
        docker run -i -t -v $CURRENT:/home/ coopie/blog-server /bin/bash
    else
        # Startup the heart_rate_deamon and then run server
        docker run  -t -p 49160:8080 -v $CURRENT:/home/ coopie/blog-server /bin/bash -c "cd home && npm start"
fi

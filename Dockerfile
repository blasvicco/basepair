# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Stage 1 - Installing essential and utility pkgs.
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

FROM alpine:edge as runtime

ENV APPDIR /home/tests

# Environment variables
ENV ESSENTIAL_PACKAGES="bash gcc g++ git gzip make mlocate npm openssh py-pip tar supervisor" \
    UTILITY_PACKAGES="nano vim ca-certificates"

# Configure essential and utility packages
RUN apk update && \
    apk --no-cache --progress add $ESSENTIAL_PACKAGES $UTILITY_PACKAGES && \
    pip install --upgrade pip && \
    pip install supervisor-stdout

RUN mkdir -p $APPDIR
ADD ./tests/package.json $APPDIR

RUN mkdir -p $APPDIR/public/stylesheets/ && \
    mkdir -p $APPDIR/public/javascripts/ && \
    cd $APPDIR && \
    npm i && \
    ln -s $APPDIR/node_modules/open-iconic $APPDIR/public/stylesheets/open-iconic && \
    ln -s $APPDIR/node_modules/socket.io-client/dist/socket.io.js $APPDIR/public/javascripts/socket.io.js && \
    ln -s $APPDIR/node_modules/socket.io-client/dist/socket.io.js.map $APPDIR/public/javascripts/socket.io.js.map

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Stage 2 - Applying needed configurations.
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

COPY ./docker/etc /etc

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Stage 3 - Adding project files into VM.
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Adding project folder and needed files
ADD ./tests $APPDIR
RUN chmod -R a+w $APPDIR

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# Stage 4 - Adding entry point.
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

# Adding entry point
ADD ./docker/entrypoint.sh /sbin/entrypoint.sh

WORKDIR $APPDIR

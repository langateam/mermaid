FROM ubuntu:14.04

# system vars
ENV DEBIAN_FRONTEND=noninteractive
ENV DEBIAN_PRIORITY=critical

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./ ./

# add langa apt source
RUN sudo apt-get update -qq
RUN sudo apt-get install -qq curl software-properties-common gnupg-curl
RUN add-apt-repository http://apt.langa.io/trails2
RUN apt-key adv --fetch-keys https://keybase.io/langa/pgp_keys.asc
RUN apt-get update -qq
RUN apt-get upgrade -qq

RUN apt-get install -qq nodejs yarn

RUN yarn

CMD [ "node", "server.js" ]

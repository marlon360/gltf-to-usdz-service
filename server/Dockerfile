
FROM marlon360/usd-from-gltf:latest

ENV SERVER_DIR="/usr/src/server"

WORKDIR ${SERVER_DIR}

# prepare nodejs dependencies
RUN apt update && \
    apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash -

# install nodejs
RUN apt -y install nodejs

COPY . .

RUN npm install


EXPOSE 3000

WORKDIR /usr/app

ENTRYPOINT [ "node", "/usr/src/server/index.js" ]
CMD [ "node", "/usr/src/server/index.js" ]
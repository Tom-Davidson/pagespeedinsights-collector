FROM node:12.18.2-alpine3.12
RUN mkdir /home/node/app
RUN chown -R node /home/node/app
USER node
COPY package.json /home/node/app
COPY src /home/node/app/src
WORKDIR /home/node/app
RUN npm install
CMD ["npm", "start"]

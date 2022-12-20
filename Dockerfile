FROM node:18.12.1-alpine3.17
RUN mkdir /home/node/app && chown -R node /home/node/app
USER node
COPY . /home/node/app
WORKDIR /home/node/app
RUN npm install
CMD ["npm", "start"]

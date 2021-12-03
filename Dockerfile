FROM node:17.2.0-alpine3.13
RUN mkdir /home/node/app
RUN chown -R node /home/node/app
USER node
COPY . /home/node/app
WORKDIR /home/node/app
RUN npm install
CMD ["npm", "start"]

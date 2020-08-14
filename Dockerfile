FROM node:12.18.2-alpine3.12
RUN mkdir /home/node/app
RUN chown -R node /home/node/app
USER node
COPY . /home/node/app
WORKDIR /home/node/app
RUN npm install
CMD ["npm", "start"]

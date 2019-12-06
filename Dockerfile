FROM node:12.13.1-alpine3.10
ADD . /app
WORKDIR /app
RUN npm install
CMD ["npm", "start"]

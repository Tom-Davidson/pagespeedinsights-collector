FROM node:12.13.1-alpine3.10
COPY . /app
WORKDIR /app
RUN npm install
CMD ["npm", "start"]

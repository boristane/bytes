FROM node:10.13

WORKDIR bytes
COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 3333
CMD [ "npm", "start" ]
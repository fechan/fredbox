FROM node:19.9-alpine3.16
COPY . /usr/src/fredbox
WORKDIR /usr/src/fredbox
RUN npm run build
CMD ["npm", "start"]

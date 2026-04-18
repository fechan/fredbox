FROM node:25-alpine
COPY . /usr/src/fredbox
WORKDIR /usr/src/fredbox
RUN npm run build
CMD ["npm", "start"]

FROM node:16-alpine
WORKDIR /app
COPY package*.json /app
RUN yarn
COPY . /app
CMD ["yarn", "start"]
EXPOSE 4000

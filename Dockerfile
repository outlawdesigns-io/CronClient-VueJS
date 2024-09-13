FROM node:latest
WORKDIR /usr/src/app/
ARG ENV
ENV TZ=America/Chicago
ENV NODE_ENV=$ENV
RUN npm install -g http-server
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --mode $ENV
EXPOSE 8080
CMD ["http-server","dist"]

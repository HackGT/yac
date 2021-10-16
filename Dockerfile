# Build container
FROM node:12-alpine AS build

WORKDIR /usr/src/yac/
COPY . /usr/src/yac/

WORKDIR /usr/src/yac/server
RUN npm install

# Runtime container
FROM node:12-alpine

COPY --from=build /usr/src/yac/server/ /usr/src/yac/server/

WORKDIR /usr/src/yac/server/

ENV TZ="America/New_York"

EXPOSE 3000
CMD ["npm", "start"]

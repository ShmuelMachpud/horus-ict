FROM registry.metzud ... node-20:3.0.0 as buildStage

USER root

WORKDIR /usr/src/app

COPY package.json ./

COPY package*.json .npmrc ./

RUN npm install

COPY . .

RUN npm run build

FROM registry.metzud .../libreoffice:latest

USER root

WORKDIR /usr/src/app

COPY --from=buildStage /usr/src/app/dist /usr/src/app/dist
COPY --from=buildStage /usr/src/app/package.json /usr/src/app/package.json
COPY --from=buildStage /usr/src/app/node_modules /usr/src/app/node_modules

EXPOSE 3001

ENTRYPOINT []

CMD ["node", "start"]
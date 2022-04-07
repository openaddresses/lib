FROM node:16-alpine3.15

EXPOSE 5000

ENV HOME=/home/openaddresses
WORKDIR $HOME

COPY ./ $HOME/lib
WORKDIR $HOME/lib

RUN npm install

CMD npm run lint \
    && npm test

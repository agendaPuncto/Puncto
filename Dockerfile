FROM centrifugo/centrifugo:latest

COPY centrifugo.json /centrifugo.json

CMD ["centrifugo", "--config", "/centrifugo.json"]

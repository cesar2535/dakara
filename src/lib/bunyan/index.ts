import bunyan from "bunyan";

const logger = bunyan.createLogger({
  name: "logger",
  serializers: bunyan.stdSerializers,
  streams: [
    { path: `./logs/dakara.log`, level: "debug" },
    { stream: process.stdout, level: "debug" },
  ],
});

export default logger;

import { ENVIROMENT } from "@/config";
import bunyan from "bunyan";

const logger = bunyan.createLogger({
  name: "logger",
  serializers: bunyan.stdSerializers,
  streams: [
    { path: `./logs/${ENVIROMENT}.log`, level: "debug" },
    { stream: process.stdout, level: "debug" },
  ],
});

export default logger;

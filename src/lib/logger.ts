import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';
const isEdge = typeof (globalThis as Record<string, unknown>).EdgeRuntime === 'string';

const options: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
};

if (isEdge) {
  // Edge Runtime (middleware) — minimal pino, no fs/transport available
} else {
  options.formatters = {
    level(label) {
      return { level: label };
    },
  };
  options.serializers = {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  };

  if (isDev) {
    options.transport = {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'HH:MM:ss.l', ignore: 'pid,hostname' },
    };
  } else {
    const logDir = process.cwd() + '/logs';
    options.transport = {
      targets: [
        { target: 'pino/file', options: {} },
        {
          target: 'pino/file',
          options: {
            destination: `${logDir}/app-${new Date().toISOString().slice(0, 10)}.log`,
            mkdir: true,
          },
        },
      ],
    };
  }
}

const logger = pino(options);

export default logger;

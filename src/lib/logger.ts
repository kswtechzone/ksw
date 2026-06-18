type Logger = {
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  debug: (...args: unknown[]) => void;
};

const prefix = (level: string) => `[${new Date().toISOString()}] [${level.toUpperCase()}]`;

const logger: Logger = {
  info: (...args: unknown[]) => console.log(prefix('info'), ...args),
  warn: (...args: unknown[]) => console.warn(prefix('warn'), ...args),
  error: (...args: unknown[]) => console.error(prefix('error'), ...args),
  debug: (...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(prefix('debug'), ...args);
    }
  },
};

export default logger;

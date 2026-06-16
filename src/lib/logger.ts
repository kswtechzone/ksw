import pino from 'pino';
import fs from 'fs';
import path from 'path';

const pinoOptions: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
};

function createStreams(): pino.StreamEntry[] {
  const streams: pino.StreamEntry[] = [
    { stream: pino.destination(1) },
  ];

  if (process.env.NODE_ENV === 'production') {
    const logsDir = path.resolve(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

    const today = new Date().toISOString().slice(0, 10);
    const logFile = path.join(logsDir, `app-${today}.log`);

    const fileStream = fs.createWriteStream(logFile, { flags: 'a' });
    streams.push({ stream: fileStream });

    cleanupOldLogs(logsDir);
  }

  return streams;
}

function cleanupOldLogs(dir: string): void {
  try {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (!file.startsWith('app-')) continue;
      const fp = path.join(dir, file);
      const stat = fs.statSync(fp);
      if (stat.isFile() && stat.mtimeMs < cutoff) {
        fs.unlinkSync(fp);
      }
    }
  } catch {
  }
}

const logger = pino(pinoOptions, pino.multistream(createStreams()));

export default logger;

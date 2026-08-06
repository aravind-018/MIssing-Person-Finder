const isDev = process.env.NODE_ENV !== "production";

const logger = {
  info: (...args) => { console.info(...args); },
  warn: (...args) => { console.warn(...args); },
  error: (...args) => { console.error(...args); },
  debug: (...args) => { if (isDev) console.debug(...args); },
};

export default logger;

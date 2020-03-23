import { createLogger, transports, format } from 'winston';
import fs from 'fs';
import DailyRotateFile from 'winston-daily-rotate-file';
import { environment, logDirectory } from '../config';

// create directory if it is not present
if (!fs.existsSync(logDirectory)) {
	// Create the directory if it does not exist
	fs.mkdirSync(logDirectory);
}

const logLevel = environment === 'development' ? 'debug' : 'info';

const options = {
	file: {
		level: logLevel,
		filename: logDirectory + '/%DATE%-logsDemo.log',
		datePattern: 'YYYY-MM-DD',
		zippedArchive: true,
		timestamp: true,
		handleExceptions: true,
		humanReadableUnhandledException: true,
		prettyPrint: true,
		json: true,
		maxsize: 5242880, // 5MB
		colorize: true,
	}
};

export = createLogger({
	transports: [
		new transports.Console({
			level: logLevel,
			format: format.combine(format.colorize(), format.simple())
		})
	],
	exceptionHandlers: [
		new DailyRotateFile(options.file),
	],
	exitOnError: false, // do not exit on handled exceptions
});
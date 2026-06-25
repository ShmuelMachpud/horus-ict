import pino, { Logger } from 'pino';
import pretty from 'pino-pretty';
import { loggerTime } from './time.helpers';
import { NODE_ENV } from '../utils/environments';

declare global {
  var log: Logger<'success'>;
}

const setLogColorByLevel = (level: number) => {
  if (level === 30) return 'blue';
  if (level === 35) return 'green';
  return 'red';
};

const stream = pretty({
  ignore: 'pid,hostname,time,label,tag,user_id,step,status,err',
  messageFormat(log, _messageKey, _levelLabel, extras) {
    const { tag, level, msg, user_id, step, status } = log;
    const { colors } = extras;
    return (
      `${colors.yellow(tag ? `[${tag}]` : '')}${colors.white(`${loggerTime()} -`)}${colors[setLogColorByLevel(level as number)](`${msg || ''} ${status || ''}`)}` +
      `${user_id && step ? `${colors[setLogColorByLevel(level as number)](`\n${step || ''}\n${user_id || ''}`)}` : ''}`
    );
  },
});

export const log = pino({ customLevels: { success: 35 } }, NODE_ENV === 'development' ? stream : undefined);

global.log = log;

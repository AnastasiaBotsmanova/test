/* eslint-disable no-console */
import {config} from 'dotenv';
import {parseCronItems, run} from 'graphile-worker';
import exitHook from 'exit-hook';

// yarn ts-node-dev src/worker/worker.ts

config();

export const delayMs = (microseconds: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, microseconds);
  });
};

const runnerPromise = run({
  connectionString: process.env.DATABASE_URL,
  concurrency: 1,
  noHandleSignals: false,
  pollInterval: 1000,
  taskList: {
    showDate: async (_payload, helpers) => {
      helpers.logger.info(new Date().toISOString());
    },
  },
  parsedCronItems: parseCronItems([{
    task: 'showDate',
    pattern: '* * * * *',
  }]),
});

async function main() {
  const runner = await runnerPromise;

  try {
    await runner.promise;
  } finally {
    console.log('finally');
    await runner.stop();
  }
}

main().catch((error) => {
  console.log('catch');
  console.error(error);
  runnerPromise.then(runner => runner.stop());
  process.exit(1);
});

exitHook(() => {
  console.log('exitHook');
  runnerPromise.then(runner => runner.stop());
});

import {config} from 'dotenv';
import {quickAddJob} from 'graphile-worker';

// yarn ts-node-dev src/helloQueue/addJob.ts

config();

const app = async () => {
  for (let i = 0; i < 10; i++) {
    await quickAddJob(
      {connectionString: process.env.DATABASE_URL},
      'hello',
      {name: 'Bobby Tables'},
    );
  }
};

app();
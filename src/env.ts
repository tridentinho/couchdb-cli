import dotenv from 'dotenv';
dotenv.config();

export const environments = {
  dev: {
    url: process.env.DEV_URL!,
    user: process.env.DEV_USER!,
    password: process.env.DEV_PASSWORD!,
  },
  stg: {
    url: process.env.STG_URL!,
    user: process.env.STG_USER!,
    password: process.env.STG_PASSWORD!,
  },
  prd: {
    url: process.env.PRD_URL!,
    user: process.env.PRD_USER!,
    password: process.env.PRD_PASSWORD!,
  }
};

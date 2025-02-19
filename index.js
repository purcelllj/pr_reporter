import fs from 'fs';
import { config } from './config.js';

const { author, token, org } = config;
const dateArg = process.argv[2];
const uri =
  `https://api.github.com/search/issues?q=org:${org}+is:pr+author:${author}+is:closed+closed:>${dateArg}`;
const headers = {
  Authorization: token,
  'User-Agent': author,
  Accept: 'application/vnd.github+json',
};

const pullRequestResult = await fetch(uri, {
  headers,
});

const json = await pullRequestResult.json();
const mapped = json.items.map((i) => {
  return {
    title: i.title,
    repository: i.repository_url.split('/').pop(),
    pull_request_link: i.pull_request.url,
    merged_at: i.pull_request.merged_at,
  };
});

fs.writeFileSync(
  'pullRequestReport.json',
  JSON.stringify(mapped, undefined, 2),
  { encoding: 'utf8' }
);

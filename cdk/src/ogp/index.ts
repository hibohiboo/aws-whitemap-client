import * as https from 'https';
import type { CloudFrontRequestHandler } from 'aws-lambda';
import { FireStoreScene, SceneBg } from './types';

declare let DEFINE_DOMAIN: string;
declare let DEFINE_SERVICE_NAME: string;
declare let DEFINE_DESCRIPTION: string;
declare let DEFINE_FIREBASE_PROJECT_ID: string;
declare let DEFINE_DEFAULT_OGP_IMAGE_URL: string;

const DOMAIN = DEFINE_DOMAIN;
const SERVICE_NAME = DEFINE_SERVICE_NAME;
const DESCRIPTION = DEFINE_DESCRIPTION;
const projectId = DEFINE_FIREBASE_PROJECT_ID;
const defaultBg = DEFINE_DEFAULT_OGP_IMAGE_URL;
const firestoreApiPath = `firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

// OGP を返したい User-Agent をリストで定義しておく。
const bots = ['Twitterbot', 'facebookexternalhit', 'Slackbot-LinkExpanding'];

const httpGet = <T>(url: string): Promise<T> =>
  new Promise((resolve, reject) => {
    // https://nodejs.org/api/http.html#http_http_get_options_callback
    https
      .get(url, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];

        let error;
        // Any 2xx status code signals a successful response but
        // here we're only checking for 200.
        if (statusCode !== 200) {
          error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
        } else if (!contentType || !/^application\/json/.test(contentType)) {
          error = new Error(
            'Invalid content-type.\n' +
              `Expected application/json but received ${contentType}`,
          );
        }
        if (error) {
          console.error(error.message);
          // Consume response data to free up memory
          res.resume();
          reject(error);
          return;
        }

        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (e) {
            console.error(e.message);
            reject(e);
          }
        });
      })
      .on('error', (e) => {
        console.error(`Got error: ${e.message}`);
        reject(e);
      });
  });

const getBgUrl = (scene: FireStoreScene) => {
  const bg = scene.fields.bg as SceneBg;
  if (!bg.mapValue) {
    return null;
  }
  return bg.mapValue.fields.url.stringValue;
};
const getTitle = (scene: FireStoreScene) => {
  return scene.fields.title.stringValue;
};

const getHTML = (title: string, ogImage: string, url: string) => {
  return `
<!doctype html>
<html lang="ja" prefix="og: http://ogp.me/ns#">
<head prefix="og: http://ogp.me/ns#">
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}｜${SERVICE_NAME}</title>
  <meta name="description" content="${DESCRIPTION}" />
  <meta name="author" content="hibohiboo">
  <meta name="keywords" content="TRPG,白地図と足跡,紙芝居" />
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="ja_JP" />
  <meta property="og:site_name" content="${SERVICE_NAME}">
  <meta property="og:title" content="${title}｜${SERVICE_NAME}" />
  <meta property="og:description" content="${DESCRIPTION}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:url" content="https://${url}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@hibohiboo" />
  <meta name="twitter:creator" content="@hibohiboo" />
</head>
<body></body>
</html>
`;
};

export const handler: CloudFrontRequestHandler = async (event) => {
  const request = event.Records[0].cf.request;
  const userAgent = request.headers['user-agent'][0].value;
  const isBotAccess = bots.some((bot) => userAgent.includes(bot));
  if (!isBotAccess) {
    return request;
  }
  const matches = /scene\/([^/]+)/.exec(request.uri);
  if (!matches) {
    return request;
  }
  const [, sceneId] = matches;
  const scene = await httpGet<FireStoreScene>(
    `https://${firestoreApiPath}/scenes/${sceneId}`,
  );
  const sceneBgUrl = getBgUrl(scene);
  const url = sceneBgUrl ? sceneBgUrl : defaultBg;
  const title = getTitle(scene);
  // Create OGP response
  const botResponse = {
    status: '200',
    headers: { 'content-type': [{ value: 'text/html;charset=UTF-8' }] },
    body: getHTML(title, url, DOMAIN + request.uri),
  };
  return botResponse;
};

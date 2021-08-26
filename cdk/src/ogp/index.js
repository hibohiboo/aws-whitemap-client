'use strict';
const DOMAIN = 'd29r5tmujsb0y1.cloudfront.net';
const SERVICE_NAME = '白地図と足跡.test';
const DESCRIPTION = '空白の地図。君の足跡。そして';

// OGP を返したい User-Agent をリストで定義しておく。
const bots = [
    'Twitterbot',
    'facebookexternalhit',
    'Slackbot-LinkExpanding'
];

exports.handler = async (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const userAgent = request.headers['user-agent'][0].value;
    const isBotAccess = bots.some((bot) => userAgent.includes(bot));
    console.log('test url', request.uri);
    console.log('test agent', request.headers['user-agent'])
    // Create OGP response
    if (isBotAccess) {

        const botResponse = {
            status: 200,
            headers: [{ 'Content-Type': 'text/html' }],
            body: getHTML(request.uri, 'https://d29r5tmujsb0y1.cloudfront.net/data/background-images/bdRCpKrNiGRXmviNTtWQ4pd9E413/ytwwDyXOwRg0BaSQRxQv.png', DOMAIN + request.uri)
        };
        callback(null, botResponse);
        return;
    }

    callback(null, request);
};


const getHTML = (title, ogImage, url) => {
  return `
<!doctype html>
<html lang="ja">
<head prefix="og: http://ogp.me/ns#">
  <meta charset="utf-8" />
  <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}｜${SERVICE_NAME}</title>
  <meta name="description" content="${DESCRIPTION}" />
  <meta property="og:url" content="https://${url}" />
  <meta name="og:type" content="website" />
  <meta name="keywords" content="TRPG,白地図と足跡,紙芝居" />
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="ja_JP" />
  <meta property="og:title" content="${title}｜${SERVICE_NAME}" />
  <meta property="og:description" content="${DESCRIPTION}" />
  <meta property="og:image" content="${ogImage}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@Twitter"  />
  <meta name="twitter:title" content="${title}｜${SERVICE_NAME}" />
  <meta name="twitter:description" content="${DESCRIPTION}" />
  <meta name="twitter:image" content="${ogImage}" />
</head>
<body></body>
</html>
`;
};
'use strict';
const DOMAIN = 'd1fffsi9eo19ed.cloudfront.net';
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
            headers:{'content-type': [{ value: 'text/html;charset=UTF-8' }]},
            body: getHTML(request.uri, 'https://d1fffsi9eo19ed.cloudfront.net/data/background-images/bdRCpKrNiGRXmviNTtWQ4pd9E413/ytwwDyXOwRg0BaSQRxQv.png', DOMAIN + request.uri)
        };
        callback(null, botResponse);
        return;
    }

    callback(null, request);
};


const getHTML = (title, ogImage, url) => {
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
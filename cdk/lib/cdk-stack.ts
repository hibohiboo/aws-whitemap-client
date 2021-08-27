import * as core from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'
import * as cf from '@aws-cdk/aws-cloudfront'
import * as iam from '@aws-cdk/aws-iam'
import * as s3deploy from '@aws-cdk/aws-s3-deployment'
import { basePath } from '../../vite.config'
import * as lambda from "@aws-cdk/aws-lambda";
import * as origins from '@aws-cdk/aws-cloudfront-origins';
interface Props extends core.StackProps {
  bucketName: string
}

export class AWSWhiteMapClientStack extends core.Stack {
  constructor(scope: core.Construct, id: string, props: Props) {
    super(scope, id, props)
    // CloudFront オリジン用のS3バケットを作成
    const bucket = this.createS3(props.bucketName)
    // CloudFront で設定する オリジンアクセスアイデンティティ を作成
    const identity = this.createIdentity(bucket)
    // S3バケットポリシーで、CloudFrontのオリジンアクセスアイデンティティを許可
    this.createPolicy(bucket, identity)
    // lambda edge作成
    const f = this.createLambdaEdge()
    // CloudFrontディストリビューションを作成
    const distribution = this.createCloudFront(bucket, identity, f)
    // 指定したディレクトリをデプロイ
    this.deployS3(bucket, distribution, '../dist')

    // 確認用にCloudFrontのURLに整形して出力
    new core.CfnOutput(this, 'CFTopURL', {
      value: `https://${distribution.distributionDomainName}/`,
    })
  }

  private createS3(bucketName: string) {
    const bucket = new s3.Bucket(this, 'S3Bucket', {
      bucketName,
      accessControl: s3.BucketAccessControl.PRIVATE,
      removalPolicy: core.RemovalPolicy.DESTROY,
      cors: [{ allowedMethods: [s3.HttpMethods.GET], allowedOrigins: ['*'], allowedHeaders: ['*'] }]
    })
    return bucket
  }

  private createIdentity(bucket: s3.Bucket) {
    const identity = new cf.OriginAccessIdentity(this, 'OriginAccessIdentity', {

      comment: `${bucket.bucketName} access identity`,
    })
    return identity
  }

  private createPolicy(bucket: s3.Bucket, identity: cf.OriginAccessIdentity) {
    const myBucketPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:GetObject',
        "s3:ListBucket"],
      principals: [
        new iam.CanonicalUserPrincipal(
          identity.cloudFrontOriginAccessIdentityS3CanonicalUserId,
        ),
      ],
      resources: [bucket.bucketArn + '/*',
      bucket.bucketArn],
    })
    bucket.addToResourcePolicy(myBucketPolicy)
  }

  private createCloudFront(
    bucket: s3.Bucket,
    identity: cf.OriginAccessIdentity,
    f: cf.experimental.EdgeFunction
  ) {
    const defaultPolicyOption = {
      cachePolicyName: 'MyPolicy',
      comment: 'A default policy',
      defaultTtl: core.Duration.days(2),
      minTtl: core.Duration.seconds(0), // core.Duration.minutes(1),
      maxTtl: core.Duration.days(365), // core.Duration.days(10),
      cookieBehavior: cf.CacheCookieBehavior.all(),
      headerBehavior: cf.CacheHeaderBehavior.none(),
      queryStringBehavior: cf.CacheQueryStringBehavior.none(),
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
    }
    const myCachePolicy = new cf.CachePolicy(this, 'myDefaultCachePolicy', defaultPolicyOption);
    const imgCachePolicy = new cf.CachePolicy(this, 'myImageCachePolicy', {
      headerBehavior: cf.CacheHeaderBehavior.allowList('Access-Control-Request-Headers', 'Access-Control-Request-Method', 'Origin'),
    });
    const origin = new origins.S3Origin(bucket, { originAccessIdentity: identity })
    return new cf.Distribution(this, 'Distribution', {
      // enableIpV6: true,
      // httpVersion: cf.HttpVersion.HTTP2,
      defaultRootObject: '/index.html',

      priceClass: cf.PriceClass.PRICE_CLASS_200,
      defaultBehavior: {
        origin,
        allowedMethods: cf.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cf.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: myCachePolicy,
      },
      additionalBehaviors: {
        'whitemap/scene/*': {
          origin,
          edgeLambdas: [
            {
              eventType: cf.LambdaEdgeEventType.VIEWER_REQUEST,
              functionVersion: f.currentVersion,
              includeBody: true,
            },
          ],

        },
        'data': {
          origin,
          cachePolicy: imgCachePolicy,
          allowedMethods: cf.AllowedMethods.ALLOW_GET_HEAD_OPTIONS
        }
      },
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/whitemap/index.html",
          ttl: core.Duration.seconds(0),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: core.Duration.seconds(0),
        }
      ]

    })
  }

  private deployS3(
    siteBucket: s3.Bucket,
    distribution: cf.Distribution,
    sourcePath: string,
  ) {
    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset(sourcePath)],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
      destinationKeyPrefix: basePath,
    })
  }

  private createLambdaEdge() {
    const f = new cf.experimental.EdgeFunction(this, "lambda-edge", {
      code: lambda.Code.fromAsset("src/ogp"),
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_14_X,
    });
    return f;
  }
}

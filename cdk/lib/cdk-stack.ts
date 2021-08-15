import * as core from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'
import * as cf from '@aws-cdk/aws-cloudfront'
import * as iam from '@aws-cdk/aws-iam'
import * as s3deploy from '@aws-cdk/aws-s3-deployment'
import { basePath } from '../../vite.config'
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
    // CloudFrontディストリビューションを作成
    const distribution = this.createCloudFront(bucket, identity)
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
      actions: ['s3:GetObject'],
      principals: [
        new iam.CanonicalUserPrincipal(
          identity.cloudFrontOriginAccessIdentityS3CanonicalUserId,
        ),
      ],
      resources: [bucket.bucketArn + '/*'],
    })
    bucket.addToResourcePolicy(myBucketPolicy)
  }

  private createCloudFront(
    bucket: s3.Bucket,
    identity: cf.OriginAccessIdentity,
  ) {
    return new cf.CloudFrontWebDistribution(this, 'Distribution', {
      // enableIpV6: true,
      // httpVersion: cf.HttpVersion.HTTP2,
      // defaultRootObject: '/index.html',
      viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      priceClass: cf.PriceClass.PRICE_CLASS_200,
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: identity,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              allowedMethods: cf.CloudFrontAllowedMethods.GET_HEAD,
              cachedMethods: cf.CloudFrontAllowedCachedMethods.GET_HEAD,
              minTtl: core.Duration.seconds(0),
              maxTtl: core.Duration.days(365),
              defaultTtl: core.Duration.days(1),
              forwardedValues: {
                queryString: false,
              },
            },
          ],
        },
      ],
    })
  }

  private deployS3(
    siteBucket: s3.Bucket,
    distribution: cf.CloudFrontWebDistribution,
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
}

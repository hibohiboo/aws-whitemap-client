#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { AWSWhiteMapClientStack } from '../lib/cdk-stack'

const app = new cdk.App()
new AWSWhiteMapClientStack(app, 'AWSWhiteMapClientStack', {
  bucketName: 'aws-whitemap-cloudfront',
})

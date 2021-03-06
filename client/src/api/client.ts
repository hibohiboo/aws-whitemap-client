import axios from 'axios';
import { awsApiURL, awsApiKey } from '@/domain/aws/constants';

const instance = axios.create({
  baseURL: awsApiURL,
  timeout: 15000,
  headers: { 'x-api-key': awsApiKey },
});

export default instance;

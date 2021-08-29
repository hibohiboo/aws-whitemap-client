if (
  !import.meta.env.VITE_PUBLIC_AWS_BASE_DOMAIN ||
  typeof import.meta.env.VITE_PUBLIC_AWS_BASE_DOMAIN !== 'string'
)
  throw new Error('VITE_PUBLIC_AWS_BASE_DOMAIN is empty');
if (
  !import.meta.env.VITE_PUBLIC_AWS_API_KEY ||
  typeof import.meta.env.VITE_PUBLIC_AWS_API_KEY !== 'string'
)
  throw new Error('VITE_PUBLIC_AWS_API_KEY is empty');
if (
  !import.meta.env.VITE_PUBLIC_AWS_CLIENT_DOMAIN ||
  typeof import.meta.env.VITE_PUBLIC_AWS_CLIENT_DOMAIN !== 'string'
)
  throw Error('VITE_PUBLIC_AWS_CLIENT_DOMAIN is empty');
export const awsApiKey = import.meta.env.VITE_PUBLIC_AWS_API_KEY;
export const awsApiURL = import.meta.env.VITE_PUBLIC_AWS_BASE_DOMAIN;
export const clientDomain = import.meta.env.VITE_PUBLIC_AWS_CLIENT_DOMAIN;

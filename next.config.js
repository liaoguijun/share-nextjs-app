function getWebConfig() {
  const PACKAGE_ENV = process.env.PACKAGE_ENV;
  switch (PACKAGE_ENV) {
    case "DEV":
      return {};
    case "ALPHA":
      return {};
    case "RELEASE":
      return {};
  }
}

const nextConfig = {
  env: {
    ...getWebConfig(),
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/:path((?!another-page$).*)',
  //       permanent: false,
  //       destination: '/index',
  //     }
  //   ]
  // }
};

module.exports = nextConfig;

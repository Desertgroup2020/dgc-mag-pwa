/** @type {import('next').NextConfig} */

const productionEndPoint = process.env.PRODUCTION_ENDPOINT;
const imageHost = process.env.PRODUCTION_IMAGE_POINT;

const nextConfig = {  
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${productionEndPoint}/:path*`,
      },
    ];
  },
  images: {
    // domains: [image_uri],
    remotePatterns: [
      {
        protocol: "https",
        hostname: imageHost,
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;


import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.giphy.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media2.giphy.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    allowedDevOrigins: ["9000-firebase-studio-1759700607133.cluster-fbfjltn375c6wqxlhoehbz44sk.cloudworkstations.dev"],
  },
   webpack(config) {
    config.module.rules.push({
      test: /\.webm$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/videos/',
          outputPath: 'static/videos/',
          name: '[name].[hash].[ext]',
        },
      },
    });

    // This rule handles all media within the src/lib/music directory
    config.module.rules.push({
      test: /\.(mp3|jpg|jpeg|png|gif)$/,
      include: /src\/lib\/music/, // Only apply this loader to the music directory
      use: {
        loader: 'file-loader',
        options: {
          publicPath: (url: string, resourcePath: string) => {
            // Creates a path like /_next/static/music/moonracer/audio.mp3
            const relativePath = resourcePath.split('src/lib/music/')[1];
            return `/_next/static/music/${relativePath}`;
          },
          outputPath: (url: string, resourcePath: string) => {
            // Outputs to static/music/{song-folder}/{filename}
            const relativePath = resourcePath.split('src/lib/music/')[1];
            return `static/music/${relativePath}`;
          },
          name: '[name].[ext]',
        },
      },
    });

    return config;
  },
};

export default nextConfig;

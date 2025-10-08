
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
    
    // Updated rule to handle both mp3 and jpg files from the music directory
    config.module.rules.push({
      test: /\.(mp3|jpg|jpeg|png|gif)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: (url: string, resourcePath: string, context: string) => {
            // This is a simplified logic. A real app might need more robust path handling.
            if (resourcePath.includes('src/lib/music')) {
              // Extract the song folder name from the resource path
              // e.g., src/lib/music/moonracer/audio.mp3 -> moonracer/audio.mp3
              const relativePath = resourcePath.split('src/lib/music/')[1];
              return `/_next/static/music/${relativePath}`;
            }
            return `/_next/static/assets/${url}`;
          },
          outputPath: 'static/music/',
          // Keep the original folder structure within the output path
          name: '[path][name].[ext]',
          context: 'src/lib',
        },
      },
    });

    return config;
  },
};

export default nextConfig;

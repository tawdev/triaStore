import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3002', pathname: '/**' },
      { protocol: 'http', hostname: '127.0.0.1', port: '3002', pathname: '/**' },
      { protocol: 'https', hostname: 'ahlanbek.com', pathname: '/**' },
      { protocol: 'https', hostname: '**.ahlanbek.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'moldroguerie.ma', pathname: '/**' },
      { protocol: 'https', hostname: '**.moldroguerie.ma', pathname: '/**' },
      { protocol: 'http', hostname: 'moldroguerie.ma', pathname: '/**' },
      { protocol: 'http', hostname: '**.moldroguerie.ma', pathname: '/**' },
      { protocol: 'https', hostname: 'i.pinimg.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.pixabay.com', pathname: '/**' },
      { protocol: 'https', hostname: 'movahome.ma', pathname: '/**' },
      { protocol: 'https', hostname: '**.movahome.ma', pathname: '/**' },
      { protocol: 'https', hostname: 'fbcdn.net', pathname: '/**' },
      { protocol: 'https', hostname: '**.fbcdn.net', pathname: '/**' },
      { protocol: 'https', hostname: 'la-lumiere.shop', pathname: '/**' },
      { protocol: 'https', hostname: '1000logos.net', pathname: '/**' },
      { protocol: 'https', hostname: 'media.licdn.com', pathname: '/**' },
      { protocol: 'https', hostname: 'avito.ma', pathname: '/**' },
      { protocol: 'https', hostname: '**.avito.ma', pathname: '/**' },
      { protocol: 'https', hostname: 'lustra.ma', pathname: '/**' },
      { protocol: 'https', hostname: '**.lustra.ma', pathname: '/**' },
      { protocol: 'https', hostname: 'decolight.ma', pathname: '/**' },
      { protocol: 'https', hostname: '**.decolight.ma', pathname: '/**' },
    ],
  },
};

export default nextConfig;

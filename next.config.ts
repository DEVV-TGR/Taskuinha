import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Só necessário enquanto a fotografia for de demonstração.
    // Ao trocar para as fotos da casa em /public/images, apagar este bloco.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.simpleicons.org" },
    ],
  },
};

export default nextConfig;

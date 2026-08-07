import type { NextConfig } from "next";

/*
  Sem `images.remotePatterns`: toda a fotografia é local, em /public/images.
  Se alguma vez voltar a haver imagem remota, é sinal de que algo correu mal —
  ver lib/images.ts.
*/
const nextConfig: NextConfig = {};

export default nextConfig;

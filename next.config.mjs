/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/:path*", // URL do backend
      },
    ];
  },
};

export default nextConfig; // Usando export default no lugar de module.exports

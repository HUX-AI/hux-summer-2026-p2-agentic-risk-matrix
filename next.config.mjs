/** @type {import('next').NextConfig} */

// BASE_PATH is set by the GitHub Pages workflow to "/<repo-name>".
// On Cloudflare Pages or local dev it stays empty. You should not need to touch this.
const basePath = process.env.BASE_PATH || '';

const nextConfig = {
  output: 'export',           // static HTML/CSS/JS only. No server, no database.
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;

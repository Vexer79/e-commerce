/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.pexels.com",
            },
            { protocol: "https", hostname: "static.wixstatic.com" },
            { protocol: "https", hostname: "people.pic1.co" },
            { protocol: "https", hostname: "app-uploads-cdn.fera.ai" },
        ],
    },
    basePath: "/e-commerce",
    output: "export",
    reactStrictMode: true,
};

export default nextConfig;

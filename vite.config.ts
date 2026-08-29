import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
    // Check if the current action is production building
    const isBuild = command === 'build';

    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                ssr: 'resources/js/ssr.tsx',
                refresh: true,
            }),
            react({
                babel: {
                    plugins: ['babel-plugin-react-compiler'],
                },
            }),
            tailwindcss(),
            // Only execute wayfinder locally when running 'npm run dev' (serve)
            // This safely bypasses the 'php artisan' crash on Vercel's build container
            ...(!isBuild ? [wayfinder({ formVariants: true })] : []),
        ],
        esbuild: {
            jsx: 'automatic',
        },
    };
});

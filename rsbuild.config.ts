import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  output: { distPath: { root: 'dist' } },
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:8080' }
  }
});

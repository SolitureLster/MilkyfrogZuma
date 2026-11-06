import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  // GitHub Pages 项目站点地址是 /MilkyfrogZuma/，本地开发也走同一路径，避免两套配置
  base: "/MilkyfrogZuma/",
  build: {
    rollupOptions: {
      external: ['sfxr'],
    }
  },
  // define: {
  //   'window.sfxr': 'sfxr',
  // },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

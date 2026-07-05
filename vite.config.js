import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import {BootstrapVueNextResolver} from 'bootstrap-vue-next/resolvers'
import IconsResolve from 'unplugin-icons/resolver';
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const pathSegments = path.dirname(filename);

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [BootstrapVueNextResolver(), IconsResolve()],
      dts: true
    }),
    Icons({
      compiler: 'vue3',
      autoInstall: true
    }),
    VitePWA({
      registerType:'prompt',
      manifest:{
        name:'Cron Monitor Dashboard',
        short_name:'Cron Monitor Dashboard',
        start_url:'/',
        display:'standalone',
        background_color:'#fafafa',
        theme_color:'#1976d2',
        icons:[
          {
            "src":"img/icons/android/android-launchericon-192-192.png",
            "sizes":"192x192",
            "type":"image/png",
            "purpose":"any"
          },
          {
            "src":"img/icons/android/android-launchericon-192-192.png",
            "sizes":"192x192",
            "type":"image/png",
            "purpose":"any"
          },
          {
            "src":"img/icons/android/android-launchericon-512-512.png",
            "sizes":"512x512",
            "type":"image/png",
            "purpose":"any"
          },
          {
            "src":"img/icons/android/android-launchericon-512-512.png",
            "sizes":"512x512",
            "type":"image/png",
            "purpose":"any"
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(pathSegments, './src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  esbuild:{
    supported:{
      'top-level-await':true
    }
  },
  // base:'/cron/'
})

import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  eslint: {
    checker: true,
  },
  runtimeConfig: {
    public: {
      backed_base_url:
        process.env.BACKEND_BASE_URL ??
        "http://infras-djang-phu6uswnjk0h-891179164.us-east-1.elb.amazonaws.com",
    },
  },
  ssr: false,
  pages: true,
  build: {
    transpile: ["vuetify"],
  },

  modules: [
    "@nuxt/eslint",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error Workaround provided in the vuetify official docs
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});

module.exports = {
  "pwa": {
    "name": "GudaFlip",
    "appMobileWebAppCache": "yes",
    "appleMobileWebAppCapable": "yes",
    "appleMobileWebAppStatusBarStyle": "black",
    "themeColor": "fc852a",
    "manifestPath": "manifest.json", 
  },
  "transpileDependencies": [
    "vuetify"
  ],
  chainWebpack: config => {
    config
        .plugin('html')
        .tap(args => {
            args[0].title = "GudaFlip";
            return args;
        })
}
}
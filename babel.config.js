module.exports = {
  presets: [
    // '@vue/cli-plugin-babel/preset',
    ['@vue/app','@vue/cli-plugin-babel/preset'],
  ],
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
}

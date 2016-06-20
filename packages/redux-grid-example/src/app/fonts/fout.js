import 'styles/fout-loading.css'
function loadFonts(d, ctx) {
  function fontLoaded() {
    ctx.loaded++
    if(ctx.loaded === ctx.fonts.length) showFonts()
  }
  function showFonts() {
    d.documentElement.className = 'wf-active'
  }
  if (d.fonts)
    ctx.fonts.forEach(font => d.fonts.load(font).then(fontLoaded))
  else showFonts()
}

loadFonts(document, { fonts: ['1em FontAwesome', '1em Lato'], loaded: 0 })

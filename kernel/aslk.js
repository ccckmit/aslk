/* ASLT : Artifical Spoken Language Toolket (人造交談語言工具 - 翻譯與剖析)
S = P* .+                // 句子 = 短語* 符號+
P = a* (N+|V+)?          // 短語 = 修飾* (名詞+|動詞+)
*/
var pinyin = require('pinyin.js')
// var pinyin = require('pinyinlite')
var kb = require('./kb')

var wi, words, errors, tags, cuts

function isTag (tag) {
  var word = words[wi]
  if (typeof word === 'undefined') return false
  return (tag === word.tag)
}

function skipNull () {
  for (;wi < words.length && words[wi].tag === ''; wi++) {
    tags[wi] = ''
    cuts[wi] = ''
    errors[wi] = ''
  }
}

function next (tag) {
  skipNull()
  var w = words[wi]
//  console.log('w=%j', w)
  tags.push(w.tag)
  cuts[wi] = ''
  if (isTag(tag)) {
    errors[wi] = ''
    wi++
    skipNull()
    return w
  } else {
    errors[wi] = w.tag + '≠' + tag
    throw Error(errors[wi])
  }
}

// S = P* .+
function S () {
  try {
    while (!isTag('.')) P()
    do { next('.') } while (isTag('.'))
  } catch (err) {
    for (; wi < words.length && words[wi].tag !== '.'; wi++) {}
    for (; wi < words.length && words[wi].tag === '.'; wi++) {}
  }
  cuts[wi - 1] = '.'
}

// P = a* (N+|V+)?
function P () {
  while (isTag('a')) next('a')
  if (!isTag('.')) {
    var t = words[wi].tag
    while (isTag(t)) next(t)
    cuts[wi - 1] = '/'
  }
}

var exps = {
  script: /^(<script.*?>.*?<\/script>)/i, // HTML script 不翻譯
  head: /^(<head>.*?<\/head>)/i, // HTML head 不翻譯
  comment: /^(<!--.*?-->)/i,     // HTML 註解不翻譯
  markup: /^(<\/?.*?>)/i,        // <tag> , </tag> , markdown: <http://.....>
  url: /^(((http)|(https)|(ftp)):\/\/[\w./]+)/i, // 超連結
  mdLinkTail: /^(\]\(\S+\))/i,   // markdown 連結 (只有連結部分不翻譯) ](url)
  mdLinkHead: /^(!?\[)/i,        // markdown 連結開頭
  tex: /^(\$\$.*?\$\$)/i,        // markdown tex 數學式不翻譯
  code: /^(↓```.*?↓```\s*↓)/i,   // markdown 程式碼不翻譯
  spaces: /^(\s+)/i,             // 一連串空白
  cet: /^(((\w*)=)?(([\u4E00-\u9FFF]{1,8}):([a-z])))/i, // (Mary=)?瑪莉:N
  et: /^((\w+)(:([a-z]))?)\W/i,  // Mary:N
  c4: /^([\u4E00-\u9FFF]{4})/,   // 四字詞
  c3: /^([\u4E00-\u9FFF]{3})/,   // 三字詞
  c2: /^([\u4E00-\u9FFF]{2})/,   // 二字詞
  c1: /^([\u4E00-\u9FFF]{1})/,   // 一字詞
  dots: /^([^\w\u4E00-\u9FFF]+)/i // 一連串標點 (非中英文)
}

function clex (text) {
  text = text.replace(/\n/g, '↓')
  var lwords = []
  var tokens = []
  for (var i = 0; i < text.length;) {
    var m = null
    var word = null
    for (var t in exps) {
      m = exps[t].exec(text.substr(i))
      if (m) {
        switch (t) {
          case 'cet': // ex: Mary=瑪莉:N
            word = {cn: m[5], en: m[3], tag: m[6]}
            kb.setByCn(word)
            break
          case 'et' : // ex: John:N
            var tag = (m[3] == null) ? 'N' : m[3] // 不認識的英文詞也視為名詞
            word = {en: m[2], tag: tag}
            break
          case 'markup': case 'mdLinkHead': case 'mdLinkTail':
          case 'spaces': case 'skips': case 'comment':
            word = { tag: '' } // 空白類型，忽略。
            console.log('m[1]=%s', m[1])
            break
          case 'tex': case 'code': case 'head': case 'script': case 'url':
            word = { tag: '.' }
            break
          case 'c4': case 'c3': case 'c2': case 'c1': // 中文詞
            word = kb.get(m[1])
            if (word == null && t === 'c1') {
              word = {cn: m[1], tag: 'N'} // 不認識的中文字，都視為名詞
            }
            break
          case 'dots': // 符號串
            word = {tag: '.'}
            break
        }
      }
      if (word != null) break
    }
    lwords.push(word)
    tokens.push(m[1])
    i = i + m[1].length
  }
  return {tokens: tokens, words: lwords}
}

function parse (lex) {
  words = lex.words
  errors = []
  tags = []
  cuts = []
  for (wi = 0; wi < words.length;) {
    S()
  }
  return {tokens: lex.tokens, words: words, errors: errors, tags: tags, cuts: cuts}
}

function english (token, word) {
  if (word.en != null) return word.en.replace(/[\s_]/g, '-')
  if (word.tag == null || word.tag === '.' || word.tag === '') return token
  return '-' + pinyin(word.cn).toString().replace(',', '_')
}

function mt (tokens, words) {
  var eWords = []
  for (var i in words) {
    eWords.push(english(tokens[i], words[i]))
  }
  return eWords
}

function analyze (text) {
  var lex = clex(text)
  console.log('詞彙：%j', lex.words)
  var p = parse(lex)
//  console.log('詞性：%j', p.tags)
//  console.log('錯誤：%j', p.errors)
  p.en = mt(lex.tokens, lex.words)
  return p
}

function report (p) {
  console.log('%j', p.tokens)
//  console.log('詞性：%j', p.tags)
 console.log('%s', formatParse(p).join('\n').trim())
//  console.log('format:%j', formatParse(p))
//  console.log('錯誤：%j', p.errors)
  console.log('%j', p.en)
  console.log('%s', p.en.join(' '))
  console.log('=========================')
}

function analysis (text) {
  var p = analyze(text)
  report(p)
}

function formatParse (p) {
  var outs = []
  for (var i = 0; i < p.words.length; i++) {
    if (p.tags[i] !== '') {
      var json = JSON.stringify(p.words[i])
      outs.push('token=' + p.tokens[i] + ' tag=' + p.tags[i] + ' cut=' + p.cuts[i] + ' word=' + json)
    }
//      outs.push('token=%s tag=%s cut=%s'p.tokens[i] + ':' + p.tags[i] + p.cuts[i])
  }
  return outs
}

module.exports = {
  kb: kb,
  parse: parse,
  clex: clex,
  mt: mt,
  english: english,
//  formatParse: formatParse,
  report: report,
  analyze: analyze,
  analysis: analysis
}

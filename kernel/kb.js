// 標記用法 ==> N:名詞 V:動詞 n:名詞修飾 v:動詞修飾 Q:疑問詞 T:句尾詞 -:刪除該詞
// 您可以在 kb.edit.mdo 中運用這些標記對 kb.mdo 修正，但請不要直接修改 kb.mdo
var path = require('path')
var fs = require('fs')
var cc = require('chinese_convert')
var mdo = require('mdo')
var kb = {
  c2eFile: path.join(__dirname, '../dictionary/kb.c2e.mdo'),
  editFile: path.join(__dirname, '../dictionary/kb.edit.mdo'),
  userFile: path.join(__dirname, '../dictionary/kb.user.mdo')
}

kb.word2normal = function (word) {
  word.cn = (word.cn != null)?cc.tw2cn(word.cn):''
  word.en = (word.en != null)?word.en.toLowerCase():''
}

kb.normalize = function (dict) {
  for (var i in dict) {
    var word = dict[i]
    kb.word2normal(word)
  }
}

var str = kb.str = function (s) {
  return s || ''
}

kb.tableFormat = function (w) {
  return str(w.tag) + '|' + str(w.cn) + '|' + str(w.en)
}

kb.saveWord = function (w) {
  fs.appendFile(kb.userFile, kb.tableFormat(w) + '\n', function (err) {
    if (err) throw Error('saveWord to %s : %j fail!', kb.userFile, w)
    console.log('  append : %j success!', w)
  })
//  w.cn = cc.tw2cn(w.cn)
//  w.en = w.en.toLowerCase()
  kb.cnMap[w.cn] = w
  kb.enMap[w.en] = w
}

kb.wordEqual = function (w1, w2) {
  if (w1 == null || w2 == null) return false
  if (w1.tag !== w2.tag) return false
  if (w1.en !== w2.en) return false
  if (w1.cn !== w2.cn) return false
  return true
//  return JSON.stringify(o1) === JSON.stringify(o2)
}

kb.set = function (w) {
  kb.word2normal(w)
  var wc = kb.getByCn(w.cn)
  var we = kb.getByEn(w.en)
  if (!kb.wordEqual(w, wc) && !kb.wordEqual(w, we)) {
    console.log('set:w=%j wc=%j we=%j', w, wc, we)
    kb.saveWord(w)
  }
}

kb.getByEn = function (w) {
  var en = w.toLowerCase()
  return kb.enMap[en]
}

kb.getByCn = function (w) {
  var cn = cc.tw2cn(w)
  var word = kb.cnMap[cn]
  if (word == null) return
  return word
/*
  if (word != null && word.tag !== '') {
    return word
  } else {
    return undefined
  }
*/
}

kb.get = function (w) {
  var word
  if (/^\w+$/i.test(w)) {
    word = kb.getByEn(w)
  } else {
    word = kb.getByCn(w)
  }
  return word
}

kb.load = function () {
//  var e2cMdo = fs.readFileSync(kb.c2eFile).toString()
//  var e2cArray = mdo.parseTable(e2cMdo, ['pos2'])
  var e2cArray = []
  var c2eMdo = fs.readFileSync(kb.c2eFile).toString()
  var c2eArray = mdo.parseTable(c2eMdo, ['count', 'pos', 'tw'])
  var editMdo = fs.readFileSync(kb.editFile).toString()
  var editArray = mdo.parseTable(editMdo)
  var userMdo = fs.readFileSync(kb.userFile).toString()
  var userArray = mdo.parseTable(userMdo)
  var dict = editArray.concat(userArray).concat(e2cArray).concat(c2eArray)
  kb.normalize(dict)
  kb.cnMap = mdo.index(dict, 'cn')
  kb.enMap = mdo.index(dict, 'en')
//  console.log('kb.enMap=%j', kb.enMap)
}

kb.load()

module.exports = kb

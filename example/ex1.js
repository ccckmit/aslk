var aslk = require('../kernel/aslk')

aslk.analysis('John:N 與 Mary=瑪莉:N 是 一 對 戀人。\n', 'c2e')
aslk.analysis('小明 和 小英:N 一起吃蘋果。\n', 'c2e')
aslk.analysis('小明有5個蘋果，給了小華3個蘋果，請問他還剩幾個蘋果？\n', 'c2e')
aslk.analysis('黑黑的天，大大的風，爸爸去捕魚，為甚麼 還 不 回 家？\n', 'c2e')
aslk.analysis('風與日。風日爭，旅人至，脫者勝，風狂吹，人緊衣，風敗，日暖照，人脫衣，日勝。\n', 'c2e')
aslk.analysis('蘋果和牛奶很好吃。\n蘋果牛奶很好喝。\n很好喝的蘋果牛奶。', 'c2e')
aslk.analysis('好大的蘋果。', 'c2e')
aslk.analysis('John 和 Mary 一起吃蘋果。\n', 'c2e')
aslk.analysis('祭拜同一位神明， supreme=至高無上:N 的天神《 法拉:N 》。', 'c2e')
aslk.analysis('人造交談語言 (ASL, Artificial aslk Language) 是一種像程式語言一樣，具有 BNF 語法規則，但ASL是用來交談的語言。', 'c2e')
aslk.analysis('測試 [超連結](https://nqu.edu.tw/abc/def) 還有 <div class="b">標記</div> 是否正確。', 'c2e')
aslk.analysis('測試 \n```js \n// 程式碼\n```\n 還有 $$數學式$$ 是否正確。', 'c2e')
aslk.analysis('測試 <style>一起吃蘋果</style> 還有  <script> // 人造交談語言 </script> 。', 'c2e')
aslk.analysis('測試 <!-- 註解 --> 還有  http://mdbookspace.com/view/ccc/README.md 超連結 。', 'c2e')
aslk.analysis('Mary is my friend.', 'e2c')
aslk.analysis('Today is the oral_defense of the ESP department in X university.', 'e2c')
aslk.analysis('In the beginning, Magneto comes in and cups of committee members fly to salute.', 'e2c')
aslk.analysis('寫程式 ( [Node.js](https://nodejs.org/) + [JavaScript](js1.md) 。', 'c2e')
var mt1 = aslk.objMt({"title":"買水果嗎？", body:"蘋果、香蕉與柳丁", value:100}, 'c2e')
console.log('mt1=%j', mt1)

var rubyMt1 = aslk.rubyMt("買水果嗎？ 蘋果、香蕉與柳丁？", 'c2e')
console.log('rubyMt1=%s', rubyMt1)

aslk.analysis('9dddd\n dd', 'c2e')



// aslk.analysis('蘋果 了 了 香蕉 吃 。 ')
// aslk.analysis('蘋果 和 香蕉 吃 。')
// aslk.analysis('吃 蘋果 香蕉 。 吃 蘋果 和 香蕉 。')

/*
aslk.analysis('小明 和 小英:N 一起吃蘋果。')
aslk.analysis('小明有5個蘋果，給了小華3個蘋果，請問他還剩幾個蘋果？')
aslk.analysis('黑黑的天，大大的風，爸爸去捕魚，為甚麼 還 不 回 家？')
aslk.analysis('John:N 與 瑪莉:N 是 一 對 戀人。')
aslk.analysis('風與日。風日爭，旅人至，脫者勝，風狂吹，人緊衣，風敗，日暖照，人脫衣，日勝。')
*/
/*
aslk.analysis('小明 有 5 個 蘋果 ， 給 了 小華 3 個 蘋果 ， 請問 他 還 剩 幾 個 蘋果 ？')
aslk.analysis('小明 和 小華 一起 吃 蘋果 。')
aslk.analysis('黑 黑 的 天 ， 大 大 的 風 ， 爸爸 去 捕 魚 ， 為甚麼 還 不 回 家 ？')
// 全文： https://www.facebook.com/photo.php?fbid=1464494203561879&set=p.1464494203561879&type=3&theater
// parse('聽 狂 風 怒 吼 ，  真 叫 我們 害怕 。 爸爸！爸爸！ 我們 心理 多麼 牽掛 ， 只要 您 早點兒 回家，就是 空 船 也罷 ！')
// parse('我 的 好 孩子 ，  爸爸 回來 啦 ！ 你 看 船艙 裡 ， 裝 滿 魚 和 蝦 ， 努力 就 有 好 收穫 ， 大 風 大 浪 不用 怕 ， 快 去 告訴 媽媽 ， 爸爸 已經 回 家 ！')
aslk.analysis('風 與 日 。 風 日 爭 ， 旅人 至 ， 脫 者 勝 ， 風 狂 吹 ， 人 緊 衣 ， 風 敗 ， 日 暖 照 ， 人 脫 衣 ， 日 勝 。')
aslk.analysis('約翰 與 安妮 是 一 對 戀人 。')
*/

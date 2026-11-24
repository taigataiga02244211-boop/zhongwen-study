const textarea = document.getElementById('sourceText');
const charCount = document.getElementById('charCount');
const clearButton = document.getElementById('clearButton');
const analyzeButton = document.getElementById('analyzeButton');
const translation = document.getElementById('translation');
const examples = document.getElementById('examples');
const words = document.getElementById('words');

const dictionary = {
  '我': { pinyin: 'Wǒ', meaning: '私／私は' },
  '你': { pinyin: 'Nǐ', meaning: 'あなた' },
  '他': { pinyin: 'Tā', meaning: '彼' },
  '她': { pinyin: 'Tā', meaning: '彼女' },
  '想': { pinyin: 'Xiǎng', meaning: 'したい／思う' },
  '学': { pinyin: 'Xué', meaning: '学ぶ／勉強する' },
  '学好': { pinyin: 'Xué hǎo', meaning: '上手に学ぶ／習得する' },
  '中文': { pinyin: 'Zhōngwén', meaning: '中国語' },
  '每天': { pinyin: 'Měitiān', meaning: '毎日' },
  '喜欢': { pinyin: 'Xǐhuan', meaning: '好き' },
  '朋友': { pinyin: 'Péngyou', meaning: '友達' },
  '很': { pinyin: 'Hěn', meaning: 'とても' },
  '好': { pinyin: 'Hǎo', meaning: 'よい／上手に' },
  '吃': { pinyin: 'Chī', meaning: '食べる' },
  '饭': { pinyin: 'Fàn', meaning: 'ご飯／食事' },
  '工作': { pinyin: 'Gōngzuò', meaning: '仕事／働く' },
  '学习': { pinyin: 'Xuéxí', meaning: '勉強する' },
  '因为': { pinyin: 'Yīnwèi', meaning: 'なぜなら' },
  '所以': { pinyin: 'Suǒyǐ', meaning: 'だから' }
};

const exampleLibrary = [
  {
    chinese: '我每天都学中文。', pinyin: 'Wǒ měitiān dōu xué Zhōngwén.', japanese: '私は毎日中国語を勉強します。'
  },
  {
    chinese: '学好中文需要坚持练习。', pinyin: 'Xué hǎo Zhōngwén xūyào jiānchí liànxí.', japanese: '中国語を上達させるには継続して練習する必要があります。'
  },
  {
    chinese: '我想和朋友一起学习。', pinyin: 'Wǒ xiǎng hé péngyou yīqǐ xuéxí.', japanese: '友達と一緒に勉強したいです。'
  },
  {
    chinese: '今天我想吃中国菜。', pinyin: 'Jīntiān wǒ xiǎng chī Zhōngguó cài.', japanese: '今日は中国料理を食べたいです。'
  }
];

function updateCount() {
  charCount.textContent = `${textarea.value.length}文字`;
}

function detectTranslation(text) {
  const translations = [
    [/我想学好中文/, '私は中国語を上手に勉強したいです。'],
    [/我喜欢.*朋友/, '私は友達が好きです。'],
    [/我每天/, '私は毎日何かをします。'],
    [/我想吃/, '私は何かを食べたいです。'],
    [/我喜欢/, '私はそれが好きです。'],
    [/我们/, '私たち'],
    [/你好/, 'こんにちは。'],
    [/谢谢/, 'ありがとうございます。'],
    [/再见/, 'さようなら。']
  ];
  return translations.find(([pattern]) => pattern.test(text))?.[1] || '入力された文章の意味を確認できます。ここから詳しい翻訳機能へつなげます。';
}

function getWords(text) {
  const found = [];
  const keys = Object.keys(dictionary).sort((a, b) => b.length - a.length);

  for (const key of keys) {
    if (text.includes(key) && !found.some(word => word.character === key)) {
      found.push({ character: key, ...dictionary[key] });
    }
  }

  const characters = [...text].filter(char => /[\u4e00-\u9fff]/.test(char));
  for (const char of characters) {
    if (!found.some(word => word.character === char)) {
      found.push({ character: char, pinyin: '—', meaning: 'この文字の辞書データがありません' });
    }
  }
  return found.slice(0, 12);
}

function renderExamples(text) {
  const selected = [...exampleLibrary].sort((a, b) => {
    const aMatch = [...text].some(char => a.chinese.includes(char));
    const bMatch = [...text].some(char => b.chinese.includes(char));
    return Number(bMatch) - Number(aMatch);
  }).slice(0, 3);

  examples.innerHTML = selected.map(item => `
    <div class="example">
      <p class="chinese">${item.chinese}</p>
      <p class="pinyin">${item.pinyin}</p>
      <p class="japanese">${item.japanese}</p>
    </div>
  `).join('');
}

function renderWords(foundWords) {
  words.innerHTML = foundWords.map(word => `
    <div class="word">
      <span class="word-character">${word.character}</span>
      <span class="word-reading">${word.pinyin}</span>
      <span class="word-meaning">${word.meaning}</span>
    </div>
  `).join('');
}

function analyze() {
  const text = textarea.value.trim();
  if (!text) {
    translation.textContent = '中国語の文章を入力してください。';
    examples.innerHTML = '';
    words.innerHTML = '';
    textarea.focus();
    return;
  }

  analyzeButton.disabled = true;
  analyzeButton.querySelector('span').textContent = '解析中…';

  window.setTimeout(() => {
    translation.textContent = detectTranslation(text);
    renderExamples(text);
    renderWords(getWords(text));
    analyzeButton.disabled = false;
    analyzeButton.querySelector('span').textContent = '解析する';
  }, 280);
}

textarea.addEventListener('input', updateCount);
clearButton.addEventListener('click', () => {
  textarea.value = '';
  updateCount();
  textarea.focus();
});
analyzeButton.addEventListener('click', analyze);
updateCount();

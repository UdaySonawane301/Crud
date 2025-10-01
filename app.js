// Home page utilities
(function(){
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const title = document.getElementById('typing-title');
  if (!title) return;

  const words = ['Welcome', 'Create', 'Read', 'Update', 'Delete'];
  let i = 0;

  function typeWord(word){
    return new Promise(resolve => {
      let idx = 0;
      const iv = setInterval(() => {
        title.textContent = word.slice(0, idx++);
        if (idx > word.length){
          clearInterval(iv);
          setTimeout(resolve, 600);
        }
      }, 60);
    });
  }
  function erase(){
    return new Promise(resolve => {
      let txt = title.textContent;
      const iv = setInterval(() => {
        txt = txt.slice(0, -1);
        title.textContent = txt;
        if (!txt){
          clearInterval(iv);
          resolve();
        }
      }, 40);
    });
  }
  async function loop(){
    while(true){
      await typeWord(words[i % words.length]);
      await erase();
      i++;
    }
  }
  loop();
})();

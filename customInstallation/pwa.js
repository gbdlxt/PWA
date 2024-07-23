// 缓存节点
const $pwaHeader = document.querySelector('#pwaHeader');
const $pwaInfoProgress = document.querySelector('#pwaInfoProgress');
const $rapidInstall = document.querySelector('#rapidInstall');

let beforeinstallpromptEvent;

// 侦测PWA有没有被安装
function isInstalledPWA() {
  return window.matchMedia('(display-mode: window-controls-overlay)').matches ||
  window.matchMedia('(display-mode: standalone)').matches;
}

if (!isInstalledPWA()) {
  // 没安装过 缓存安装实例
  $rapidInstall.innerHTML = 'Rapid Install';
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    beforeinstallpromptEvent = e;
  });
} else {
  // 已安装过，显示开始
  $rapidInstall.innerHTML = 'Play';
}

$rapidInstall.addEventListener('click', ()=> {
  if(!isInstalledPWA() && beforeinstallpromptEvent) {
    // 未安装 下载
    beforeinstallpromptEvent.prompt();
    // 监听安装结果
    beforeinstallpromptEvent.userChoice.then((choiceResult) => {
      if(choiceResult.outcome === 'accepted') {
        // 安装中，转换样式
        $rapidInstall.innerHTML = 'Installing';
        $pwaHeader.classList.toggle('active');
        let count = 0;
        // 做个假的安装进度，安装5s
        const timer = setInterval(()=> {
          if(count === 100) {
            $pwaHeader.classList.toggle('active');
            $rapidInstall.innerHTML = 'Play';
            clearInterval(timer);
            return;
          }
          count ++;
          $pwaInfoProgress.innerHTML = count + '%';
        }, 50);
      }
      // 重置事件
      beforeinstallpromptEvent = null
    });
  }else {
    // 已安装，打开
    location.href = '/';
  }
});


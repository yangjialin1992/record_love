document.addEventListener('DOMContentLoaded', function() {
    // 设置起始日期（请将这里的日期改为你们在一起的开始时间）
    const startDate = new Date('2019-01-04 00:00:00');

    function updateCountdown() {
        const now = new Date();
        const diff = Math.max(0, now - startDate);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    // 初始更新
    updateCountdown();

    // 每秒更新一次
    const timer = setInterval(updateCountdown, 1000);

    // 清理定时器
    window.addEventListener('unload', () => {
        clearInterval(timer);
    });

    // 添加装饰元素
    function addDecorations() {
        // 创建装饰元素容器
        const decorationContainer = document.createElement('div');
        decorationContainer.className = 'decoration-container';
        document.body.appendChild(decorationContainer);
        
        // 添加花朵装饰
        for(let i = 0; i < 8; i++) {
            const flower = document.createElement('div');
            flower.className = 'decoration flower';
            flower.style.left = Math.random() * 100 + '%';
            flower.style.top = Math.random() * 100 + '%';
            decorationContainer.appendChild(flower);
        }

        // 添加星星装饰
        for(let i = 0; i < 12; i++) {
            const star = document.createElement('div');
            star.className = 'decoration star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            decorationContainer.appendChild(star);
        }
    }

    // 添加鼠标跟随效果
    document.addEventListener('mousemove', function(e) {
        const decorations = document.querySelectorAll('.decoration');
        const rect = document.querySelector('.content-box').getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        decorations.forEach(decoration => {
            const speed = 0.02;
            const x = (centerX - e.clientX) * speed;
            const y = (centerY - e.clientY) * speed;
            decoration.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    function randomLoveText() {
        fetch('static/loveTexts.txt') // 替换为实际路径
        .then(response => response.text())
        .then(data => {
            const loveTexts = data.split('\n'); // 将文本按行分割为数组
            const randomIndex = Math.floor(Math.random() * loveTexts.length);
            const loveTextElement = document.querySelector('.love-text');
            loveTextElement.textContent = loveTexts[randomIndex];
        })
        .catch(error => {
            console.error('Error fetching love texts:', error);
        });
    }

    // 初始化装饰
    addDecorations();
    //随机一言
    randomLoveText();
    // fetch('https://api.shadiao.pro/chp')
    // .then(response => response.json())
    // .then(data => {
    //     const loveText = document.querySelector('.love-text');
    //     loveText.textContent = data.data.text;
    // })
    // .catch(error => {
    //     console.error('Error fetching data:', error);
    // });

    document.querySelector('.heartbeat-container').addEventListener('click', function() {
        const loadingOverlay = document.getElementById('loading-overlay');
        const watermarks = addWatermarks('我是大水印');
        const heartbeatContainer = document.querySelector('.heartbeat-container');

        // 添加时间显示
        const timeDisplay = document.createElement('div');
        timeDisplay.className = 'time-display';
        const now = new Date();
        const timeString = "当前时间 " + now.getFullYear() + '年' + 
                          String(now.getMonth() + 1).padStart(2, '0') + '月' +
                          String(now.getDate()).padStart(2, '0') + '日 ' +
                          String(now.getHours()).padStart(2, '0') + ':' +
                          String(now.getMinutes()).padStart(2, '0') + ':' +
                          String(now.getSeconds()).padStart(2, '0');
        timeDisplay.textContent = timeString;
        
        // 先隐藏原有的心电图内容
        const heartbeatSVG = heartbeatContainer.querySelector('svg');
        if (heartbeatSVG) {
            heartbeatSVG.style.display = 'none';
        }
        
        // 添加时间显示
        heartbeatContainer.appendChild(timeDisplay);

        // 先生成图片
        html2canvas(document.body).then(canvas => {
            // 图片生成完成后再显示加载动画
            loadingOverlay.style.display = 'flex';
            
            const previewImage = document.getElementById('preview-image');
            if (previewImage) {
                previewImage.src = canvas.toDataURL('image/png');
                document.getElementById('preview-modal').style.display = 'block';
            } else {
                console.error('Preview image element not found');
            }

            // 移除水印
            removeWatermarks(watermarks);
            // 移除时间显示
            heartbeatContainer.removeChild(timeDisplay);
            // 恢复心电图显示
            if (heartbeatSVG) {
                heartbeatSVG.style.display = 'block';
            }
            // 隐藏加载动画
            loadingOverlay.style.display = 'none';
        }).catch(error => {
            console.error('Error generating screenshot:', error);
            // 确保在出错时也恢复原状
            if (timeDisplay.parentNode) {
                heartbeatContainer.removeChild(timeDisplay);
            }
            if (heartbeatSVG) {
                heartbeatSVG.style.display = 'block';
            }
            loadingOverlay.style.display = 'none';
        });
    });

    document.getElementById('close-button').addEventListener('click', function() {
        document.getElementById('preview-modal').style.display = 'none';
    });

    document.getElementById('download-button').addEventListener('click', function() {
        const link = document.createElement('a');
        link.href = document.getElementById('preview-image').src;
        link.download = '爱小王.png';
        link.click();
        document.getElementById('preview-modal').style.display = 'none';
    });

    document.querySelectorAll('.photo-item img').forEach(img => {
        img.addEventListener('click', function() {
            const imagePreview = document.getElementById('image-preview');
            imagePreview.src = this.src;
            document.getElementById('image-preview-modal').style.display = 'block';
        });
    });

    document.getElementById('image-close-button').addEventListener('click', function() {
        document.getElementById('image-preview-modal').style.display = 'none';
    });

    function addWatermarks(watermarkText) {
        const watermarks = [];
        const positions = [
            { top: '10%', left: '10%' },
            { top: '10%', left: '80%' },
            { top: '80%', left: '10%' },
            { top: '80%', left: '80%' },
            { top: '50%', left: '50%' }
        ]; // 预定义的水印位置

        positions.forEach(position => {
            const watermark = document.createElement('div');
            watermark.textContent = watermarkText;
            watermark.style.position = 'fixed';
            watermark.style.opacity = '0.1'; // 透明度
            watermark.style.fontSize = '20px'; // 字体大小
            watermark.style.color = '#000'; // 字体颜色
            watermark.style.pointerEvents = 'none';
            watermark.style.zIndex = '1000';
            watermark.style.transform = 'rotate(-30deg)';
            
            // 使用预定义的位置
            watermark.style.top = position.top;
            watermark.style.left = position.left;

            document.body.appendChild(watermark);
            watermarks.push(watermark);
        });

        return watermarks;
    }

    function removeWatermarks(watermarks) {
        watermarks.forEach(watermark => document.body.removeChild(watermark));
    }

    function adjustHeartbeatPosition() {
        const photoGrid = document.querySelector('.photo-grid');
        const heartbeatContainer = document.querySelector('.heartbeat-container');

        if (photoGrid && heartbeatContainer) {
            const gridRect = photoGrid.getBoundingClientRect();
            heartbeatContainer.style.top = `${gridRect.bottom + 5}px`; // 在九宫格底部下方10px
        }
    }
    
    window.addEventListener('load', adjustHeartbeatPosition);
    window.addEventListener('resize', adjustHeartbeatPosition);

    // 检查是否是 iOS Safari 浏览器
    function isIOSSafari() {
        const ua = window.navigator.userAgent;
        const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
        const webkit = !!ua.match(/WebKit/i);
        const iOSSafari = iOS && webkit && !ua.match(/CriOS/i) && !ua.match(/OPiOS/i);
        return iOSSafari;
    }

    // 检查是否是从主屏幕打开
    function isInStandaloneMode() {
        return (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('ios-app://');
    }

    // 检查是否已经显示过提示
    function hasShownPrompt() {
        return localStorage.getItem('addToHomeScreenPrompt') === 'shown';
    }

    // 显示添加到主屏幕的提示
    function showAddToHomeScreenPrompt() {
        if (!isIOSSafari() || isInStandaloneMode() || hasShownPrompt()) {
            return;
        }

        const prompt = document.createElement('div');
        prompt.className = 'add-to-home-screen-prompt';
        prompt.innerHTML = `
            <div class="prompt-content">
                <button class="close-prompt">&times;</button>
                <p>点击下方<span class="share-icon">分享</span>按钮，选择"添加到主屏幕"，随时打开都能看到我哦~</p>
                <div class="arrow-down"></div>
            </div>
        `;
        document.body.appendChild(prompt);

        // 添加关闭按钮事件
        prompt.querySelector('.close-prompt').addEventListener('click', function() {
            prompt.remove();
            localStorage.setItem('addToHomeScreenPrompt', 'shown');
        });

        // 30秒后自动关闭
        setTimeout(() => {
            if (prompt.parentElement) {
                prompt.remove();
                localStorage.setItem('addToHomeScreenPrompt', 'shown');
            }
        }, 30000);
    }

    // 延迟 2 秒显示提示
    setTimeout(showAddToHomeScreenPrompt, 2000);
}); 

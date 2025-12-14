// 導航列滾動效果
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// 漢堡選單切換
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const isOpen = hamburger.classList.contains('open');
    
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', !isOpen);
    
    // 防止背景滾動
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

// FAQ 切換
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // 關閉所有其他 FAQ
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });
    
    // 切換當前 FAQ
    faqItem.classList.toggle('active');
}

// 模擬營業狀態
function updateStatus() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    const statusBanner = document.getElementById('statusBanner');
    const statusTitle = document.getElementById('statusTitle');
    const statusDesc = document.getElementById('statusDesc');
    const statusTime = document.getElementById('statusTime');
    
    // 顯示當前時間
    statusTime.textContent = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // 週日、週一公休
    if (day === 0 || day === 1) {
        statusBanner.classList.add('closed');
        statusTitle.textContent = '本日公休';
        statusDesc.textContent = '週二至週六營業 · 07:00 開始';
        return;
    }
    
    // 營業時間判斷（週二至週六 07:00-12:00，售完為止）
    if (hour < 7) {
        statusBanner.classList.add('closed');
        statusTitle.textContent = '尚未營業';
        statusDesc.textContent = `今日 07:00 開始營業 · 請稍後`;
    } else if (hour >= 7 && hour < 12) {
        statusBanner.classList.remove('closed');
        statusTitle.textContent = '🔥 營業中';
        statusDesc.textContent = '07:00-12:00 營業 · 售完為止';
    } else {
        statusBanner.classList.add('closed');
        statusTitle.textContent = '今日已售完';
        statusDesc.textContent = '明日 07:00 見 · 感謝支持';
    }
}

// 初始化並每分鐘更新一次
updateStatus();
setInterval(updateStatus, 60000);

// 平滑滾動
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length === 1) return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            
            // 如果選單是開啟的，關閉它
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        }
    });
});

// 點擊外部關閉選單
document.addEventListener('click', (e) => {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !hamburger.contains(e.target)) {
        toggleMenu();
    }
});
// ===== 粒子飄散效果 =====
function createParticles() {
    const statusBanner = document.getElementById('statusBanner');
    if (!statusBanner) return;
    
    // 創建粒子容器
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
    `;
    statusBanner.appendChild(particleContainer);
    
    // 創建多個粒子
    const particleCount = 12; // 粒子數量
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // 隨機位置和大小
        const size = Math.random() * 6 + 4; // 4-10px
        const startX = Math.random() * 100; // 0-100%
        const endX = startX + (Math.random() * 40 - 20); // ±20%
        const duration = Math.random() * 4 + 4; // 4-8秒
        const delay = Math.random() * 3; // 0-3秒延遲
        const opacity = Math.random() * 0.4 + 0.4; // 0.4-0.8
        
        particle.style.cssText = `
            position: absolute;
            bottom: 0;
            left: ${startX}%;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, 
                rgba(255, 255, 255, ${opacity}) 0%, 
                rgba(255, 255, 255, ${opacity * 0.5}) 50%, 
                transparent 100%
            );
            border-radius: 50%;
            pointer-events: none;
            animation: particleRise ${duration}s ease-in-out ${delay}s infinite;
            box-shadow: 
                0 0 ${size * 1.5}px rgba(255, 255, 255, ${opacity * 0.6}),
                0 0 ${size * 2.5}px rgba(255, 255, 255, ${opacity * 0.3});
        `;
        
        particleContainer.appendChild(particle);
    }
}

// 當DOM加載完成後創建粒子
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createParticles);
} else {
    createParticles();
}

// ===== 精緻輪播 Banner 功能 =====
let currentSlide = 0;
let slideInterval;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

// 顯示指定的幻燈片
function showSlide(index) {
    // 處理索引邊界
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }
    
    // 更新所有幻燈片的狀態
    slides.forEach((slide, i) => {
        slide.classList.remove('active', 'prev');
        if (i === currentSlide) {
            slide.classList.add('active');
        } else if (i < currentSlide) {
            slide.classList.add('prev');
        }
    });
    
    // 更新指示點
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

// 移動到下一張/上一張
function moveSlide(direction) {
    showSlide(currentSlide + direction);
    resetSlideInterval(); // 重置自動播放計時器
}

// 直接跳到指定張
function goToSlide(index) {
    showSlide(index);
    resetSlideInterval(); // 重置自動播放計時器
}

// 自動播放
const SLIDE_INTERVAL_TIME = 5000; // 5秒切換一次

function startSlideShow() {
    // 確保先清除任何現有的計時器
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    
    slideInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, SLIDE_INTERVAL_TIME);
}

// 重置自動播放計時器
function resetSlideInterval() {
    // 清除現有計時器
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    // 重新開始完整的5秒計時
    startSlideShow();
}

// 初始化輪播
function initSlider() {
    if (slides.length > 0) {
        showSlide(0);
        startSlideShow();
        
        // 觸控滑動支援（手機版）
        let touchStartX = 0;
        let touchEndX = 0;
        
        const slider = document.querySelector('.hero-slider');
        if (slider) {
            slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
        }
        
        function handleSwipe() {
            const swipeThreshold = 50; // 最小滑動距離
            if (touchEndX < touchStartX - swipeThreshold) {
                // 向左滑動 - 下一張
                moveSlide(1);
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // 向右滑動 - 上一張
                moveSlide(-1);
            }
        }
        
        // 滑鼠懸停時暫停自動播放
        slider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            startSlideShow();
        });
    }
}

// 當DOM載入完成後初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlider);
} else {
    initSlider();
}

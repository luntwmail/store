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

// ===== 簡化版磁吸拖曳輪播 =====
class MagneticSlider {
    constructor() {
        this.slider = document.querySelector('.hero-slider');
        this.container = document.querySelector('.slider-container');
        this.slides = Array.from(document.querySelectorAll('.slide'));
        this.dots = Array.from(document.querySelectorAll('.dot'));
        
        if (!this.slider || this.slides.length === 0) return;
        
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        
        // 拖曳狀態
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.dragDistance = 0;
        
        // 自動播放
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
        
        this.init();
    }
    
    init() {
        this.showSlide(0);
        this.bindEvents();
        this.startAutoPlay();
    }
    
    bindEvents() {
        // 滑鼠事件
        this.container.addEventListener('mousedown', this.onDragStart.bind(this));
        document.addEventListener('mousemove', this.onDragMove.bind(this));
        document.addEventListener('mouseup', this.onDragEnd.bind(this));
        
        // 觸控事件
        this.container.addEventListener('touchstart', this.onDragStart.bind(this), { passive: true });
        document.addEventListener('touchmove', this.onDragMove.bind(this), { passive: true });
        document.addEventListener('touchend', this.onDragEnd.bind(this));
        
        // 指示點點擊
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // 暫停/繼續自動播放
        this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    onDragStart(e) {
        this.isDragging = true;
        this.container.style.cursor = 'grabbing';
        
        this.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        this.currentX = this.startX;
        this.dragDistance = 0;
        
        this.stopAutoPlay();
    }
    
    onDragMove(e) {
        if (!this.isDragging) return;
        
        const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        this.dragDistance = x - this.startX;
        this.currentX = x;
    }
    
    onDragEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.container.style.cursor = 'grab';
        
        const threshold = 50; // 50px 觸發切換
        
        if (this.dragDistance < -threshold) {
            // 向左拖 - 下一張
            this.nextSlide();
        } else if (this.dragDistance > threshold) {
            // 向右拖 - 上一張
            this.prevSlide();
        }
        
        this.dragDistance = 0;
        
        // 重啟自動播放
        setTimeout(() => this.startAutoPlay(), 1000);
    }
    
    showSlide(index) {
        this.currentIndex = index;
        
        // 更新所有 slides - 只透過 Class 控制，讓 CSS 處理顯示邏輯
        this.slides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev');
            if (i === index) {
                slide.classList.add('active');
            } else if (i < index) {
                slide.classList.add('prev');
            }
        });
        
        // 更新指示點
        this.updateDots();
    }
    
    updateDots() {
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });
    }
    
    goToSlide(index) {
        this.stopAutoPlay();
        this.showSlide(index);
        setTimeout(() => this.startAutoPlay(), 1000);
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.totalSlides;
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(prevIndex);
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// 初始化磁吸輪播
let magneticSlider;

function initMagneticSlider() {
    magneticSlider = new MagneticSlider();
    
    // 綁定控制按鈕
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            magneticSlider.stopAutoPlay();
            magneticSlider.prevSlide();
            setTimeout(() => magneticSlider.startAutoPlay(), 1000);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            magneticSlider.stopAutoPlay();
            magneticSlider.nextSlide();
            setTimeout(() => magneticSlider.startAutoPlay(), 1000);
        });
    }
}

// 當DOM載入完成後初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMagneticSlider);
} else {
    initMagneticSlider();
}

// ========================================
// 菜單 Lightbox 功能 - v9.3.7.1
// ========================================

// 開啟菜單燈箱
function openMenuLightbox() {
    const lightbox = document.getElementById('menuLightbox');
    if (lightbox) {
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden'; // 防止背景滾動
    }
}

// 關閉菜單燈箱
function closeMenuLightbox() {
    const lightbox = document.getElementById('menuLightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // 恢復滾動
    }
}

// 按 ESC 鍵關閉燈箱
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
        closeMenuLightbox();
    }
});

// 點擊燈箱圖片或關閉按鈕時阻止關閉（只有點擊背景才關閉）
document.addEventListener('DOMContentLoaded', function() {
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeButton = document.querySelector('.lightbox-close-button');
    
    // 阻止圖片點擊關閉
    if (lightboxImage) {
        lightboxImage.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
    
    // 阻止標題點擊關閉
    if (lightboxCaption) {
        lightboxCaption.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
    
    // 阻止關閉按鈕的點擊事件向上傳播（按鈕本身會觸發 closeMenuLightbox）
    if (closeButton) {
        closeButton.addEventListener('click', function(event) {
            event.stopPropagation();
            closeMenuLightbox();
        });
    }
});

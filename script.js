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
    
    // 營業時間判斷（週二至週六 07:00-09:30）
    if (hour < 7) {
        statusBanner.classList.add('closed');
        statusTitle.textContent = '尚未營業';
        statusDesc.textContent = `今日 07:00 開始營業 · 請稍後`;
    } else if (hour === 7 || (hour === 8) || (hour === 9 && minute < 30)) {
        statusBanner.classList.remove('closed');
        statusTitle.textContent = '🔥 營業中';
        statusDesc.textContent = '預計 09:30 售完 · 建議提前訂購';
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
document.addEventListener('DOMContentLoaded', () => {
  const leadForm = document.querySelector('.lead-form');
  const successField = document.querySelector('.form__success');
  const floatingCta = document.querySelector('.floating-cta');
  const yearLabel = document.getElementById('year');

  // ✅ 設定你的 Google Apps Script Web App URL
  const SCRIPT_URL ='https://script.google.com/macros/s/AKfycbynNILmTYnsKtbRkqHf_9lXvN7DTLpT5QUyXcmUTGYmcLEti4UTb7WeoaYP2CSdhlV4/exec';

  if (yearLabel) {
    yearLabel.textContent = new Date().getFullYear();
  }

  const smoothScrollTo = (selector) => {
    const target = document.querySelector(selector);
    if (!target) return;
    const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    });
  };

  if (leadForm && successField) {
    leadForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(leadForm);

      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        role: formData.get('role'),
        message: formData.get('message'),
        createdAt: new Date().toISOString(),
      };

      successField.textContent = '資料送出中，請稍候...';

      try {
        // ✅ 送資料到 Google Apps Script
        const response = await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (result.status === 'success') {
          successField.textContent = '已收到您的需求，顧問將於 24 小時內與您聯繫。';
          leadForm.reset();
        } else {
          successField.textContent = '送出失敗，請稍後再試。';
        }

        // ✅ 同步存到 localStorage（備份）
        const stored = JSON.parse(localStorage.getItem('mora-leads') ?? '[]');
        stored.push(payload);
        localStorage.setItem('mora-leads', JSON.stringify(stored));

      } catch (error) {
        console.error('送出表單時發生錯誤：', error);
        successField.textContent = '送出失敗，請檢查網路或稍後再試。';
      }

      setTimeout(() => {
        successField.textContent = '';
      }, 8000);
    });
  }

  if (floatingCta) {
    floatingCta.addEventListener('click', () => {
      const targetSelector = floatingCta.dataset.scroll ?? '#lead-form';
      smoothScrollTo(targetSelector);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const hash = anchor.getAttribute('href');
      if (hash && hash.length > 1) {
        event.preventDefault();
        smoothScrollTo(hash);
      }
    });
  });

  const autoPlayVideos = document.querySelectorAll('.js-autoplay-video');

  if (autoPlayVideos.length) {
    autoPlayVideos.forEach((video) => {
      video.muted = true;
      video.setAttribute('muted', '');
      video.loop = true;
      video.setAttribute('loop', '');
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target;
            const shouldPlayOnce = video.dataset.autoplayOnce === 'true';

            if (entry.isIntersecting && entry.intersectionRatio > 0.2) {
              const playPromise = video.play();
              if (playPromise && typeof playPromise.then === 'function') {
                playPromise.catch(() => {});
              }

              if (shouldPlayOnce) {
                observer.unobserve(video);
              }
            } else if (!shouldPlayOnce) {
              video.pause();
            }
          });
        },
        {
          threshold: [0.2, 0.4, 0.6, 0.8],
          rootMargin: '0px',
        }
      );

      autoPlayVideos.forEach((video) => observer.observe(video));
    } else {
      autoPlayVideos.forEach((video) => {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.catch(() => {});
        }
      });
    }
  }
});

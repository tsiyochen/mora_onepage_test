document.addEventListener('DOMContentLoaded', () => {
  const leadForm = document.querySelector('.lead-form');
  const successField = document.querySelector('.form__success');
  const floatingCta = document.querySelector('.floating-cta');
  const yearLabel = document.getElementById('year');

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
    leadForm.addEventListener('submit', (event) => {
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

      leadForm.reset();
      successField.textContent = '已收到您的需求，顧問將於 24 小時內與您聯繫。';

      try {
        const stored = JSON.parse(localStorage.getItem('mora-leads') ?? '[]');
        stored.push(payload);
        localStorage.setItem('mora-leads', JSON.stringify(stored));
      } catch (error) {
        console.warn('無法儲存至 localStorage', error);
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
});


<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-section">
        <h3 class="footer-title">MyBook</h3>
        <p class="footer-text">Hệ thống mượn sách online - Mang đến cho bạn trải nghiệm đọc sách tuyệt vời.</p>
      </div>

      <div class="footer-section">
        <h3 class="footer-title">Liên kết nhanh</h3>
        <ul class="footer-links">
          <li><a href="/about" class="footer-link">Về chúng tôi</a></li>
          <li><a href="/contact" class="footer-link">Liên hệ</a></li>
          <li><a href="/terms" class="footer-link">Điều khoản sử dụng</a></li>
          <li><a href="/privacy" class="footer-link">Chính sách bảo mật</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h3 class="footer-title">Kết nối với chúng tôi</h3>
        <div class="social-icons">
          <a href="https://facebook.com" class="social-icon" target="_blank">
            <img src="../assets/facebook-icon.png" alt="Facebook" />
          </a>
          <a href="https://twitter.com" class="social-icon" target="_blank">
            <img src="../assets/twitter-icon.png" alt="Twitter" />
          </a>
          <a href="https://instagram.com" class="social-icon" target="_blank">
            <img src="../assets/instagram-icon.png" alt="Instagram" />
          </a>
        </div>
      </div>

      <div class="footer-section">
        <h3 class="footer-title">Địa chỉ</h3>
        <p class="footer-text">123 Đường ABC, Quận XYZ, Thành phố Cần Thơ</p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>© 2025 MyBook - Hệ thống mượn sách online | Tất cả quyền được bảo lưu</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #2b7852; 
  color: #ffffff;
  padding: 40px 20px;
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 50px;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.footer-section {
  flex: 1;
  padding: 15px;
  min-width: 220px;
  margin: 0 15px;
}

.footer-title {
  font-size: 18px;
  font-weight: bold;
  color: #eafff0;
  margin-bottom: 15px;
}

.footer-text {
  font-size: 14px;
  color: #d1e8e4;
  line-height: 1.5;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-link {
  display: block;
  font-size: 14px;
  color: #d1e8e4;
  margin: 8px 0;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #ffcc00; /* Màu vàng khi hover */
}

.social-icons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 10px;
}

.social-icon img {
  width: 30px;
  height: 30px;
  transition: transform 0.3s;
}

.social-icon:hover img {
  transform: scale(1.1); /* Hiệu ứng zoom khi hover */
}

.footer-bottom {
  margin-top: 30px;
  font-size: 14px;
  color: #d1e8e4;
}
</style>

$(document).ready(function (){
  function truncate(str, maxLength) {
    return str.length > maxLength ? str.slice(0, maxLength).trim() + '...' : str;
  }

  const isEnglish = window.location.pathname.includes('/en');

  fetch('https://blog.shai.pro/api/latest-news')
    .then(response => response.json())
    .then(data => {
      if (data.success && data.data.length > 0) {
        const newsList = document.getElementById("news-block");
        let html = '';

        data.data.forEach(item => {
          const current_url = item.source ? item.source : `https://blog.shai.pro/post/${item.id}`;
          const current_title = truncate(item.title, 65);
          const current_descr = truncate(item.descr, 90);

          html += `
                       <div class="block">
                          <a href="${current_url}" class="absoluteStyle" target="_blank"></a>
                          <p class="category"></p>
                          <div class="headBlock">
                              <p class="title">${current_title}</p>
                              <img src="https://blog.shai.pro/storage/${item.image}" alt="">
                          </div>
                          <p class="descr">${current_descr}</p>
                          <button class="defaultButton linkStyle">
                              ${isEnglish ? 'Read more' : 'Подробнее'}
                              <span class="iconify plus" data-icon="si:arrow-right-line" data-inline="false"></span>
                          </button>
                      </div>
                    `;
        });

        newsList.innerHTML = html;
        document.getElementById("main-news-block").style.display = "block";
      }
    })
    .catch(error => {
      console.error("Ошибка загрузки новостей:", error);
    });
});

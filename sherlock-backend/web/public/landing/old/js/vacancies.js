document.addEventListener("DOMContentLoaded", () => {
  const isEnglish = window.location.pathname.includes('/en');

  const apiUrl = 'https://blog.shai.pro/api/vacancies';

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.success && data.data.length > 0) {
        const vacanciesList = document.getElementById("vacancies-block");
        let html = '';

        data.data.forEach(item => {
          html += `
                <div class="col-sm-12">
                    <div class="vacancyItem">
                        <p class="name">${item.name}</p>
                        <div class="bottom">
                            <p class="tags">
                                <span class="city">${item.city}</span>
                                <span>${item.format}</span>
                                <span>${item.time}</span>
                            </p>
                            <div class="d-none vacancyInfo">
                                <h3 class="first">Tasks:</h3>
                                <div class="htmlBlock" id="tasks-body">${item.tasks}</div>
            
                                <h3>Requirements:</h3>
                                <div class="htmlBlock" id="requirements-body">${item.requirements}</div>
            
                                <h3>Terms:</h3>
                                <div class="htmlBlock" id="terms-body">${item.terms}</div>
                            </div>
                            <button class="defaultButton linkStyle">
                                ${isEnglish ? 'More details' : 'Подробнее'}
                                <span class="iconify plus" data-icon="si:arrow-right-line" data-inline="false"></span>
                            </button>
                        </div>
                    </div>
                </div>
          `;
        });

        vacanciesList.innerHTML = html;

        $('.vacancyItem').click(function(){
          let name = $(this).find('p.name').text();
          let city = $(this).find('span.city').text();
          let body = $(this).find('.vacancyInfo').html();

          $('#vacancy-item-block h2').text(name);
          $('#vacancy-item-block #city').text(city);
          $('#vacancy-item-block #vacancy-body').html(body);

          $('#main-vacancies-block').addClass('d-none');
          $('#vacancy-item-block').removeClass('d-none');
        });

      }
    })
    .catch(error => {
      console.error("Ошибка загрузки вакансий:", error);
    });
});

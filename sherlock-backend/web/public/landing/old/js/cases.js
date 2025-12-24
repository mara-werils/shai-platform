document.addEventListener("DOMContentLoaded", () => {
  const categoryTitles = {
    "1": "Bioelectronic Medicine",
    "2": "Finance and Investment",
    "3": "Industrial Equipment",
    "4": "Government Procurement and Regulation",
    "5": "Education and Educational Consulting"
  };

  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get("category");

  const categoryId = categoryParam ? categoryParam.split(",")[0] : "1";

  const h1Element = document.querySelector("h1");
  if (h1Element) {
    h1Element.textContent = categoryTitles[categoryId] || "Bioelectronic Medicine";
  }
  // window.history.replaceState(null, '', '/shai-cases/'+categoryId);

  const apiUrl = `https://blog.shai.pro/api/cases?category_id=${encodeURIComponent(categoryId)}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.success && data.data.length > 0) {
        const casesList = document.getElementById("cases-block");
        let html = '';

        data.data.forEach(item => {
          html += `
            <div class="col-sm-4">
              <div class="caseInItem">
                  <div class="logoBlock">
                      <img src="https://blog.shai.pro/storage/${item.logo}" alt="">
                  </div>
                  <p class="name bWeight">${item.name}</p>
                  <div class="caseFullInfo d-none">
                      <p class="name bWeight">${item.name}</p>
                      <p class="text">
                          <span>Sphere:</span><span>${item.sphere}</span>
                      </p>
                      <p class="text">
                          <span>About the client:</span><span>${item.client}</span>
                      </p>
                      <p class="text">
                          <span>Task:</span><span>${item.task}</span>
                      </p>
                      <p class="text">
                          <span>Solution:</span><span>${item.solution}</span>
                      </p>
                  </div>
              </div>
            </div>
          `;
        });

        casesList.innerHTML = html;

        $('.caseInItem').click(function(){
          let case_info = $(this).find('.caseFullInfo').html();
          $('#caseInfoBox').html(case_info);
          $('.caseModal').show();
        });

      }
    })
    .catch(error => {
      console.error("Ошибка загрузки кейсов:", error);
    });
});

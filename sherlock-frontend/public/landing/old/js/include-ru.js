async function includeHTML(id, file) {
  const element = document.getElementById(id);
  const res = await fetch(file);
  if (res.ok) element.innerHTML = await res.text();
}
includeHTML('header', '/landing/components/ru/header.html');
includeHTML('footer', '/landing/components/ru/footer.html');

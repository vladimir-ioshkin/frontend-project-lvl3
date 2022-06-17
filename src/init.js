import 'bootstrap';

const app = () => {
  const element = document.getElementById('main');

  const html = `
<form action="" class="rss-form text-body"><div class="row"><div class="col"><div class="form-floating"><input id="url-input" autofocus="" required="" name="url" aria-label="url" class="form-control w-100" placeholder="ссылка RSS" autocomplete="off"> <label for="url-input">Ссылка RSS</label></div></div><div class="col-auto"><button type="submit" aria-label="add" class="h-100 btn btn-lg btn-primary px-sm-5">Добавить</button></div></div></form>
`;

  element.innerHTML = html;
};

export default app;
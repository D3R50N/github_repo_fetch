function dom_id(id) {
  return document.getElementById(id);
}
window.onload = function () {
  dom_id("github_uname").value = localStorage.getItem("github_username");

  dom_id("preloader").remove();
};

const github_uname = () => dom_id("github_uname").value;
const fetch_btn = dom_id("fetch_btn");
const repos = dom_id("repos");

fetch_btn.addEventListener("click", async () => {
  let uname = "";
  uname = github_uname().toString();

  if (uname.trim().length == 0) {
    return;
  }

  localStorage.setItem("github_username", uname);

    const url = `https://github.com/${uname}/?tab=repositories`;
    
  let headers = new Headers();
  headers.append("Content-Type", "text/html");

  const init = {
    method: "GET",
    headers: headers,
    mode: "cors",
    cache: "default",
  };

  let request = new Request(url);

  const html = await fetch(request, init);

  repos.innerHTML = html;
});

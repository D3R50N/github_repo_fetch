function dom_id(id) {
  return document.getElementById(id);
}
window.onload = function () {
  dom_id("github_uname").value = localStorage.getItem("github_username");

  dom_id("preloader").remove();
};

const github_uname = () => dom_id("github_uname").value;
const fetch_btn = dom_id("fetch_btn");
const repos_dom = dom_id("repos");

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

    //! NOTE for testing
    // let request = new Request("github_curl_out.html");

     let request = new Request(url);

    fetch_btn.innerText = "Fetching ...";
    fetch_btn.setAttribute("disabled", true);
    const response = await fetch(request, init);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const repo_list = doc.querySelectorAll("[itemprop='owns']");


    const repos = [];

    repo_list.forEach((repo) => {
        repos.push({
          name: repo.querySelector("[itemprop='name codeRepository']")
            .innerText.trim(),
          description: repo.querySelector("[itemprop='description']")
            ?.innerText.trim(),
        });
    });

    
    fetch_btn.innerText = "Fetch repos";
    fetch_btn.removeAttribute("disabled");
    repos_dom.innerHTML = "";
    for (let repo of repos) {
        let div = document.createElement("div");
        let h3 = document.createElement("h3");
        h3.innerText = repo.name;
        div.appendChild(h3);


        if (repo.description) {
            let p = document.createElement("p");
            p.innerText = repo.description;
            div.appendChild(p);
        }
        div.classList.add("repo");

        div.addEventListener("click", () => { 
            window.open( `https://github.com/${uname}/${repo.name}`);
        });

        repos_dom.appendChild(div);
    }

});

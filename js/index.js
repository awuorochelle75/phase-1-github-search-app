document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const repoList = document.getElementById("repos-list");
    const toggleButton = document.getElementById("toggle-search");
    let searchType = "user";

    
    toggleButton.addEventListener("click", () => {
        searchType = searchType === "user" ? "repo" : "user";
        toggleButton.textContent = `Search by ${searchType === "user" ? "Users" : "Repositories"}`;
    });

  
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            searchType === "user" ? searchUsers(query) : searchRepos(query);
        }
    });

  
    function searchUsers(query) {
        fetch(`https://api.github.com/search/users?q=${query}`, {
            headers: { "Accept": "application/vnd.github.v3+json" }
        })
        .then(response => response.json())
        .then(data => displayUsers(data.items))
        .catch(error => console.error("Error fetching users:", error));
    }

   
    function displayUsers(users) {
        userList.innerHTML = "";
        repoList.innerHTML = "";
        users.forEach(user => {
            const userItem = document.createElement("li");
            userItem.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50">
                <a href="${user.html_url}" target="_blank">${user.login}</a>
                <button onclick="fetchRepos('${user.login}')">View Repos</button>
            `;
            userList.appendChild(userItem);
        });
    }

   
    window.fetchRepos = function(username) {
        fetch(`https://api.github.com/users/${username}/repos`, {
            headers: { "Accept": "application/vnd.github.v3+json" }
        })
        .then(response => response.json())
        .then(data => displayRepos(data))
        .catch(error => console.error("Error fetching repositories:", error));
    };

    function displayRepos(repos) {
        repoList.innerHTML = "";
        repos.forEach(repo => {
            const repoItem = document.createElement("li");
            repoItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
            repoList.appendChild(repoItem);
        });
    }

   
    function searchRepos(query) {
        fetch(`https://api.github.com/search/repositories?q=${query}`, {
            headers: { "Accept": "application/vnd.github.v3+json" }
        })
        .then(response => response.json())
        .then(data => displayRepos(data.items))
        .catch(error => console.error("Error fetching repositories:", error));
    }
});

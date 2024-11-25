document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    // Validate the username
    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,30}$/;
        if (!regex.test(username)) {
            alert("Invalid username format. Only letters, numbers, underscores, and dashes are allowed.");
            return false;
        }
        return true;
    }

    // Fetch user details
    async function fetchUserDetails(username) {
        try {
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            statsContainer.classList.add("hidden");

            const apiUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error("Unable to fetch user details. Please check the username.");
            }

            const data = await response.json();
            console.log("Fetched data:", data);

            if (data.status === "error") {
                throw new Error(data.message || "User not found.");
            }

            displayUserData(data);
        } catch (error) {
            statsContainer.innerHTML = `<p>${error.message}</p>`;
            console.error("Error fetching user details:", error);
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    // Update progress circle and labels
    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    // Display user data
    function displayUserData(data) {
        const totalEasyQues = data.totalEasy;
        const totalMediumQues = data.totalMedium;
        const totalHardQues = data.totalHard;

        const solvedEasyQues = data.easySolved;
        const solvedMediumQues = data.mediumSolved;
        const solvedHardQues = data.hardSolved;

        statsContainer.classList.remove("hidden");

        updateProgress(solvedEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedHardQues, totalHardQues, hardLabel, hardProgressCircle);

        const cardsData = [
            { label: "Total Questions", value: data.totalQuestions },
            { label: "Total Solved", value: data.totalSolved },
            { label: "Acceptance Rate", value: `${data.acceptanceRate}%` },
        ];

        cardStatsContainer.innerHTML = cardsData
            .map(
                (card) => `
                <div class="card">
                    <h4>${card.label}</h4>
                    <p>${card.value}</p>
                </div>`
            )
            .join("");
    }

    // Add event listener to the search button
    searchButton.addEventListener("click", function () {
        const username = usernameInput.value;
        console.log("Username entered:", username);
        if (validateUsername(username)) {
            fetchUserDetails(username);
        }
    });
});

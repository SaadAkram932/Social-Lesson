const API_KEY = "AIzaSyBGnrrP5iGUpZgWtapFBkxuAnNg5ei6U-k"; // Replace with your actual API key
const API_URL = "https://www.googleapis.com/youtube/v3";

let allVideos = [];
let currentPage = 1;
const videosPerPage = 4; // Set to 4 videos per page

function getChannelUploads(channelId) {
    // Get the uploads playlist ID
    $.ajax({
        url: `${API_URL}/channels`,
        method: "GET",
        data: {
            key: API_KEY,
            part: "contentDetails",
            id: channelId
        },
        success: function(response) {
            if (response.items.length > 0) {
                const uploadsId = response.items[0].contentDetails.relatedPlaylists.uploads;
                fetchVideosFromPlaylist(uploadsId);
            }
        },
        error: function(error) {
            console.error("Error fetching channel details:", error);
        }
    });
}

function fetchVideosFromPlaylist(playlistId) {
    // Fetch videos from the uploads playlist
    $.ajax({
        url: `${API_URL}/playlistItems`,
        method: "GET",
        data: {
            key: API_KEY,
            part: "snippet",
            maxResults: 50, // Get a maximum of 50 videos in one request
            playlistId: playlistId
        },
        success: function(response) {
            allVideos = response.items;
            setupPagination();
            displayVideos(currentPage);
        },
        error: function(error) {
            console.error("Error fetching videos from playlist:", error);
        }
    });
}

function displayVideos(page) {
    const videoContainer = document.getElementById("videos");
    videoContainer.innerHTML = ""; // Clear current videos

    const start = (page - 1) * videosPerPage;
    const end = Math.min(start + videosPerPage, allVideos.length);

    for (let i = start; i < end; i++) {
        const video = allVideos[i];
        const iframe = document.createElement("iframe");
        iframe.width = "500";
        iframe.height = "255";
        iframe.src = `https://www.youtube.com/embed/${video.snippet.resourceId.videoId}`;
        iframe.allowFullscreen = true;
        
        const title = document.createElement("p");
        title.innerText = video.snippet.title;
        
        const videoDiv = document.createElement("div");
        videoDiv.classList.add("video-item");
        videoDiv.appendChild(iframe);
        videoDiv.appendChild(title);
        
        videoContainer.appendChild(videoDiv);
    }
}

function setupPagination() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "<span>Page No.</span>";

    const totalPages = Math.ceil(allVideos.length / videosPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement("button");
        pageLink.classList.add("pageButton");
        pageLink.innerText = i;
        pageLink.onclick = function() {
            currentPage = i;
            displayVideos(currentPage);
        };
        paginationContainer.appendChild(pageLink);
    }
}

// Fetch and display videos on page load
document.addEventListener("DOMContentLoaded", function() {
const channelId = "UCaC1vI8n9zwlwuueuZngOWw"; 
//  const channelId = "UCSy0559PhXT0_2Kwe-s8e7A";
    getChannelUploads(channelId);
});

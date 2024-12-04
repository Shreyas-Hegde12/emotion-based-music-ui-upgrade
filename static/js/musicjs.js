let isPlaying = false;
        let loading = false;
        let songFetched = false;
        let audioElement = new Audio();
        const playButton = document.querySelector('.play-button div');
        function togglePlay() {

            isPlaying = !isPlaying;

            if (!songFetched | loading) { 
                playButton.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><radialGradient id='a5' cx='.66' fx='.66' cy='.3125' fy='.3125' gradientTransform='scale(1.5)'><stop offset='0' stop-color='#fff'></stop><stop offset='.3' stop-color='#fff' stop-opacity='.9'></stop><stop offset='.6' stop-color='#fff' stop-opacity='.6'></stop><stop offset='.8' stop-color='#fff' stop-opacity='.3'></stop><stop offset='1' stop-color='#fff' stop-opacity='0'></stop></radialGradient><circle transform-origin='center' fill='none' stroke='url(#a5)' stroke-width='15' stroke-linecap='round' stroke-dasharray='200 1000' stroke-dashoffset='0' cx='100' cy='100' r='70'><animateTransform type='rotate' attributeName='transform' calcMode='spline' dur='2' values='360;0' keyTimes='0;1' keySplines='0 0 1 1' repeatCount='indefinite'></animateTransform></circle><circle transform-origin='center' fill='none' opacity='.2' stroke='#fff' stroke-width='15' stroke-linecap='round' cx='100' cy='100' r='70'></circle></svg>";

                loading = true;
                return;
            }
    
            // Update play/pause icon
            playButton.textContent = isPlaying ? '⏸' : '▶';

            if (isPlaying) {
                audioElement.play();
            } else {
                audioElement.pause();
            }
        }


        // Initialize Audio and Slider
        function updateSlider(bool) {
            const slider = document.getElementById("music-slider");
            if(bool==0){
                slider.max = audioElement.duration;
                setInterval(() => {
                    slider.value = audioElement.currentTime;
                }, 1000);
            }
            if(bool==1){
                audioElement.currentTime = slider.value;
            }
        }

        // Set Audio Source 
        function setSong(data) {
            if (data) {
                // Check and truncate title if it's longer than 20 characters
                if (data.mainsong.title.length > 20) {
                    data.mainsong.title = data.mainsong.title.slice(0, 17) + '...';  // Truncate to 17 characters and add '...'
                }
            
                // Check and truncate artist if it's longer than 18 characters
                if (data.mainsong.artist.length > 18) {
                    data.mainsong.artist = data.mainsong.artist.slice(0, 15) + '...';  // Truncate to 15 characters and add '...'
                }
            }
            
            document.querySelector('.player img').src = data.mainsong.coverart || 'https://img.freepik.com/premium-photo/white-natural-paper-texture-clean-square-background-wallpaper_118047-7127.jpg';
            document.querySelector('.player img').setAttribute('data-videoid', data.mainsong.videoid);
            document.querySelector('.player h2').textContent = data.mainsong.title || 'Unknown Title';
            document.querySelector('.player p').textContent = data.mainsong.artist || 'Unknown Artist';

            document.querySelector('#similar1 img').src = data.similar1.coverart || 'https://img.freepik.com/premium-photo/white-natural-paper-texture-clean-square-background-wallpaper_118047-7127.jpg';
            document.querySelector('#similar1').setAttribute('data-videoid', data.similar1.videoid);
            document.querySelector('#similar1 h3').textContent = data.similar1.title || 'Unknown Title';
            document.querySelector('#similar1 p').textContent = data.similar1.artist || 'Unknown Artist';
            
            document.querySelector('#similar2 img').src = data.similar2.coverart || 'https://img.freepik.com/premium-photo/white-natural-paper-texture-clean-square-background-wallpaper_118047-7127.jpg';
            document.querySelector('#similar2').setAttribute('data-videoid', data.similar2.videoid);
            document.querySelector('#similar2 h3').textContent = data.similar2.title || 'Unknown Title';
            document.querySelector('#similar2 p').textContent = data.similar2.artist || 'Unknown Artist';

            document.querySelector('#similar3 img').src = data.similar3.coverart || 'https://img.freepik.com/premium-photo/white-natural-paper-texture-clean-square-background-wallpaper_118047-7127.jpg';
            document.querySelector('#similar3').setAttribute('data-videoid', data.similar3.videoid);
            document.querySelector('#similar3 h3').textContent = data.similar3.title || 'Unknown Title';
            document.querySelector('#similar3 p').textContent = data.similar3.artist || 'Unknown Artist';
            audioElement.pause();
            if(isPlaying) togglePlay();
            songFetched = false;
            fetchUrl(data.mainsong.videoid);
            updateSlider(0);
        }

        document.addEventListener('DOMContentLoaded',fetchSongOnEmotion('starter'));

        // Fetch Song on emotion
        async function fetchSongOnEmotion(emotion) {
                const response = await fetch('/getsongs', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ 'emotion': emotion }),
                }).then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                }).then(data => {
                    console.log("Received data:", data);
                    setSong(data)
                }).catch(error => {
                    console.error("Error fetching data:", error);
                });
            }

        async function fetchUrl(videoid){
            const response = await fetch('/songurl', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ 'videoid': videoid }),
                }).then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                }).then(data => {
                    console.log("Received data:", data);
                    audioElement.src = data.songurl;
                    songFetched = true;
                    if(loading == true) {
                        audioElement.play();
                        playButton.textContent ='⏸';
                        loading = false;
                    }
                }).catch(error => {
                    console.error("Error fetching data:", error);
                });

        }

        //Similar Track Play
        async function similarsongclick(id){
            videoid = document.querySelector(id).getAttribute('data-videoid');
            artists = document.querySelector(id).querySelector('p').innerText;

            const response = await fetch('/continuesongs', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ 'videoid': videoid, 'artists': artists }),
                }).then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                }).then(data => {
                    console.log("Received data:", data);
                    setSong(data)
                }).catch(error => {
                    console.error("Error fetching data:", error);
                });

        }
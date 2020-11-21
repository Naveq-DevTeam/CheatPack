const readyStateCheckInterval = setInterval(() => {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		let xhr = new XMLHttpRequest();
		let testportalCheat, testportalOptionsTimeCheat;
		chrome.runtime.sendMessage({ query: "serverAddress" }, function (response) {
			let serverAddress = response.serverAddress;

			chrome.storage.sync.get(['testportalCheat', 'testportalOptionsTimeCheat'], async (result) => {
				testportalCheat = result.testportalCheat ? true : false;
				testportalOptionsTimeCheat = result.testportalOptionsTimeCheat ? true : false;

				if (testportalCheat) {
					xhr.open('GET', `${serverAddress}/testportal/inject.js`, true); // Base inject script
					xhr.send(null);
				}

				let scriptNumber = 0;

				xhr.onload = () => {
					if (xhr.status == 200) {
						const scriptElement = document.createElement('script');
						script = document.createTextNode(xhr.responseText);
						scriptElement.appendChild(script);
						scriptElement.type = 'text/javascript';
						document.body.appendChild(scriptElement);
						scriptNumber++;
						nextXHR(scriptNumber);
						if (scriptNumber == 2) console.info(`%c${chrome.i18n.getMessage('testportalLoading')}`, "font-style: italic"); // Console log to make sure the script has been loaded. IF NOTHING IS SHOWN IN THE CONSOLE, DO NOT RUN THE TEST !!!
					}
				}

				const nextXHR = (scriptNumber) => {
					if (scriptNumber == 1) {
						if (testportalCheat) {
							xhr.open('GET', `${serverAddress}/testportal/anti_blurspy.js`, true); // Focus cheat
							xhr.send(null);
						}
					}
					if (scriptNumber == 2) {
						if (testportalOptionsTimeCheat) {
							xhr.open('GET', `${serverAddress}/testportal/antitime.js`, true); // Time bypass script
							xhr.send(null);
						}
					}
				}
			});
		});
	};
}, 10)

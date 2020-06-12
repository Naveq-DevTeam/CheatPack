chrome.runtime.sendMessage({ query: "serverAddress" }, function (response) {
	let serverAddress = response.serverAddress; // Server address

	// I18n for sidebar links.
	document.getElementById('settingsLink').innerHTML = chrome.i18n.getMessage('settingsLink');
	document.getElementById('informationsLink').innerHTML = chrome.i18n.getMessage('informationsLink');
	document.getElementById('discordLink').innerHTML = chrome.i18n.getMessage('discordLink');

	// Naming individual sites based on I18n.
	document.getElementById('testportalHeader').innerHTML = chrome.i18n.getMessage('testportalName');
	document.getElementById('quizizzHeader').innerHTML = chrome.i18n.getMessage('quizizzName');
	document.getElementById('brainlyHeader').innerHTML = chrome.i18n.getMessage('brainlyName');
	document.getElementById('librusHeader').innerHTML = chrome.i18n.getMessage('librusName');

	// We ask the user what cheats he wants to use. Using I18n we translate these questions.
	document.getElementById('testportalCheatQuestion').innerHTML = chrome.i18n.getMessage('testportalCheatQuestion');
	document.getElementById('quizizzCheatQuestion').innerHTML = chrome.i18n.getMessage('quizizzCheatQuestion');
	document.getElementById('brainlyCheatQuestion').innerHTML = chrome.i18n.getMessage('brainlyCheatQuestion');
	document.getElementById('librusCheatQuestion').innerHTML = chrome.i18n.getMessage('librusCheatQuestion');

	// Discord link
	document.getElementById('discordLink').href = `https://cheatpack.glitch.me/discord`;

	// I18n for experimental warning.
	Array.from(document.querySelectorAll('.experimentalWarning')).forEach(label => {
		label.innerHTML += chrome.i18n.getMessage('experimentalWarning');
	});

	// And we translate checkbox labels...
	Array.from(document.querySelectorAll('.cheatEnableLabel')).forEach(label => {
		label.innerHTML += chrome.i18n.getMessage('cheatEnableLabel');
	});

	// And now we are adding event listeners for checkboxes.
	const testportalCheckbox = document.getElementById('testportalCheckbox');
	const quizizzCheckbox = document.getElementById('quizizzCheckbox');
	const brainlyCheckbox = document.getElementById('brainlyCheckbox');
	const librusCheckbox = document.getElementById('librusCheckbox');

	testportalCheckbox.addEventListener('change', () => {
		if (testportalCheckbox.checked) {
			chrome.storage.sync.set({ 'testportalCheat': true });
			document.getElementById('testportalOptionsTimeCheatCheckbox').disabled = false;
		} else {
			chrome.storage.sync.set({ 'testportalCheat': false });
			document.getElementById('testportalOptionsTimeCheatCheckbox').disabled = true;
		}
	});
	quizizzCheckbox.addEventListener('change', () => {
		if (quizizzCheckbox.checked) {
			chrome.storage.sync.set({ 'quizizzCheat': true });
			document.getElementById('quizizzOptionsAutoAnswerCheckbox').disabled = false;
			if (document.getElementById('quizizzOptionsAutoAnswerCheckbox').checked) document.getElementById('quizizzOptionsAutoAnswerTime').disabled = false;
		} else {
			chrome.storage.sync.set({ 'quizizzCheat': false });
			document.getElementById('quizizzOptionsAutoAnswerCheckbox').disabled = true;
			document.getElementById('quizizzOptionsAutoAnswerTime').disabled = true;
		}
	});
	brainlyCheckbox.addEventListener('change', () => {
		if (brainlyCheckbox.checked) {
			chrome.storage.sync.set({ 'brainlyCheat': true });
		} else {
			chrome.storage.sync.set({ 'brainlyCheat': false });
		}
	});
	librusCheckbox.addEventListener('change', () => {
		if (librusCheckbox.checked) {
			chrome.storage.sync.set({ 'librusCheat': true });
			document.getElementById('librusOptionsPositiveFraction').disabled = false;
			document.getElementById('librusOptionsNegativeFraction').disabled = false;
			document.getElementById('librusOptionsDefaultWeight').disabled = false;

			document.getElementById('librusOptionsUseWeightsCheckbox').disabled = false;
			document.getElementById('librusOptionsRespectPolicyCheckbox').disabled = false;
			document.getElementById('librusOptionsCountZerosCheckbox').disabled = false;
		} else {
			chrome.storage.sync.set({ 'librusCheat': false });
			document.getElementById('librusOptionsPositiveFraction').disabled = true;
			document.getElementById('librusOptionsNegativeFraction').disabled = true;
			document.getElementById('librusOptionsDefaultWeight').disabled = true;

			document.getElementById('librusOptionsUseWeightsCheckbox').disabled = true;
			document.getElementById('librusOptionsRespectPolicyCheckbox').disabled = true;
			document.getElementById('librusOptionsCountZerosCheckbox').disabled = true;
		}
	});

	// We will now check what settings are setted and mark the appropriate checkboxes when some of them are already set. 
	chrome.storage.sync.get(['testportalCheat'], (result) => {
		document.getElementById('testportalCheckbox').checked = result.testportalCheat ? true : false;
		if (!document.getElementById('testportalCheckbox').checked) {
			document.getElementById('testportalOptionsTimeCheatCheckbox').disabled = true;
		}
	});
	chrome.storage.sync.get(['quizizzCheat'], (result) => {
		document.getElementById('quizizzCheckbox').checked = result.quizizzCheat ? true : false;
		if (!document.getElementById('quizizzCheckbox').checked) {
			document.getElementById('quizizzOptionsAutoAnswerCheckbox').disabled = true;
			document.getElementById('quizizzOptionsAutoAnswerTime').disabled = true;
		}
	});
	chrome.storage.sync.get(['brainlyCheat'], (result) => {
		document.getElementById('brainlyCheckbox').checked = result.brainlyCheat ? true : false;
	});
	chrome.storage.sync.get(['librusCheat'], (result) => {
		document.getElementById('librusCheckbox').checked = result.librusCheat ? true : false;
		if (!document.getElementById('librusCheckbox').checked) {
			document.getElementById('librusOptionsPositiveFraction').disabled = true;
			document.getElementById('librusOptionsNegativeFraction').disabled = true;
			document.getElementById('librusOptionsDefaultWeight').disabled = true;

			document.getElementById('librusOptionsUseWeightsCheckbox').disabled = true;
			document.getElementById('librusOptionsRespectPolicyCheckbox').disabled = true;
			document.getElementById('librusOptionsCountZerosCheckbox').disabled = true;
		}
	});

	// And again I18n...
	Array.from(document.querySelectorAll('.cheatOptionsHeader')).forEach(element => {
		element.innerHTML = chrome.i18n.getMessage('cheatOptionsHeader'); ``
	});

	// I18n for Quizizz cheat options.
	document.getElementById('quizizzOptionsAutoAnswerLabel').innerHTML += chrome.i18n.getMessage('quizizzOptionsAutoAnswerLabel');
	document.getElementById('AutoAnswerTimeLabel').innerHTML += chrome.i18n.getMessage('AutoAnswerTimeLabel');
	document.getElementById('seconds').innerHTML = chrome.i18n.getMessage('seconds');

	// I18n for Testportal cheat options.
	document.getElementById('testportalOptionsTimeCheatLabel').innerHTML += chrome.i18n.getMessage('testportalOptionsTimeCheatLabel');

	// I18n for Librus cheat options.
	document.getElementById('librusOptionsPositiveFractionLabel').innerHTML += chrome.i18n.getMessage('librusOptionsPositiveFractionPlaceholder');
	document.getElementById('librusOptionsNegativeFractionLabel').innerHTML += chrome.i18n.getMessage('librusOptionsNegativeFractionPlaceholder');
	document.getElementById('librusOptionsDefaultWeightLabel').innerHTML += chrome.i18n.getMessage('librusOptionsDefaultWeightPlaceholder');

	document.getElementById('librusOptionsUseWeightsLabel').innerHTML += chrome.i18n.getMessage('librusOptionsUseWeightsLabel');
	document.getElementById('librusOptionsRespectPolicyLabel').innerHTML += chrome.i18n.getMessage('librusOptionsRespectPolicyLabel');
	document.getElementById('librusOptionsCountZerosLabel').innerHTML += chrome.i18n.getMessage('librusOptionsCountZerosLabel');

	// Quizizz cheat options.
	const quizizzOptionsAutoAnswerCheckbox = document.getElementById('quizizzOptionsAutoAnswerCheckbox');
	const quizizzAutoAnswerTimeInput = document.getElementById('quizizzOptionsAutoAnswerTime');

	quizizzOptionsAutoAnswerCheckbox.addEventListener('change', () => {
		if (quizizzOptionsAutoAnswerCheckbox.checked) {
			chrome.storage.sync.set({ 'quizizzOptionsAutoAnswer': true });
			quizizzAutoAnswerTimeInput.disabled = false;
		} else {
			chrome.storage.sync.set({ 'quizizzOptionsAutoAnswer': false });
			quizizzAutoAnswerTimeInput.disabled = true;
		}
	});

	chrome.storage.sync.get(['quizizzOptionsAutoAnswer', 'quizizzAutoAnswerTime'], (result) => {
		if (result.quizizzOptionsAutoAnswer == true) {
			quizizzOptionsAutoAnswerCheckbox.checked = true;
		} else {
			quizizzAutoAnswerTimeInput.disabled = true;
		}
		quizizzAutoAnswerTimeInput.value = result.quizizzAutoAnswerTime;
	});

	quizizzAutoAnswerTimeInput.addEventListener('input', () => {
		quizizzOptionsAutoAnswerCheckbox.checked = true;
		chrome.storage.sync.set({ 'quizizzOptionsAutoAnswer': true });
		if (quizizzAutoAnswerTimeInput.value == '') quizizzAutoAnswerTimeInput.value = 0;
		while (quizizzAutoAnswerTimeInput.value.charAt(0) === '0' && quizizzAutoAnswerTimeInput.value != 0) {
			quizizzAutoAnswerTimeInput.value = quizizzAutoAnswerTimeInput.value.substr(1);
		}
		chrome.storage.sync.set({ 'quizizzAutoAnswerTime': quizizzAutoAnswerTimeInput.value });
	});

	// Testportal cheat options.
	const testportalOptionsTimeCheatCheckbox = document.getElementById('testportalOptionsTimeCheatCheckbox');

	testportalOptionsTimeCheatCheckbox.addEventListener('change', () => {
		if (testportalOptionsTimeCheatCheckbox.checked) {
			chrome.storage.sync.set({ 'testportalOptionsTimeCheat': true });
		} else {
			chrome.storage.sync.set({ 'testportalOptionsTimeCheat': false });
		}
	});

	chrome.storage.sync.get(['testportalOptionsTimeCheat'], (result) => {
		testportalOptionsTimeCheatCheckbox.checked = result.testportalOptionsTimeCheat ? true : false;
	});

	// Librus cheat options.
	const librusOptionsPositiveFractionInput = document.getElementById('librusOptionsPositiveFraction');
	const librusOptionsNegativeFractionInput = document.getElementById('librusOptionsNegativeFraction');
	const librusOptionsDefaultWeightInput = document.getElementById('librusOptionsDefaultWeight');
	const librusOptionsUseWeightsCheckbox = document.getElementById('librusOptionsUseWeightsCheckbox');
	const librusOptionsRespectPolicyCheckbox = document.getElementById('librusOptionsRespectPolicyCheckbox');
	const librusOptionsCountZerosCheckbox = document.getElementById('librusOptionsCountZerosCheckbox');

	librusOptionsPositiveFractionInput.addEventListener('input', () => {
		if (isNaN(librusOptionsPositiveFractionInput.value)) librusOptionsPositiveFractionInput.value = 0.5;
		chrome.storage.sync.set({ 'librusOptionsPositiveFraction': librusOptionsPositiveFractionInput.value });
	});
	librusOptionsNegativeFractionInput.addEventListener('input', () => {
		if (isNaN(librusOptionsNegativeFractionInput.value)) librusOptionsNegativeFractionInput.value = 0.25;
		chrome.storage.sync.set({ 'librusOptionsNegativeFraction': librusOptionsNegativeFractionInput.value });
	});
	librusOptionsDefaultWeightInput.addEventListener('input', () => {
		if (isNaN(librusOptionsDefaultWeightInput.value)) librusOptionsDefaultWeightInput.value = 1;
		chrome.storage.sync.set({ 'librusOptionsDefaultWeight': librusOptionsDefaultWeightInput.value });
	});

	librusOptionsPositiveFractionInput.addEventListener('blur', () => {
		if (librusOptionsPositiveFractionInput.value == "") librusOptionsPositiveFractionInput.value = 0.5;
		chrome.storage.sync.set({ 'librusOptionsPositiveFraction': librusOptionsPositiveFractionInput.value });
	});
	librusOptionsNegativeFractionInput.addEventListener('blur', () => {
		if (librusOptionsNegativeFractionInput.value == "") librusOptionsNegativeFractionInput.value = 0.25;
		chrome.storage.sync.set({ 'librusOptionsNegativeFraction': librusOptionsNegativeFractionInput.value });
	});
	librusOptionsDefaultWeightInput.addEventListener('blur', () => {
		if (librusOptionsDefaultWeightInput.value == "") librusOptionsDefaultWeightInput.value = 1;
		chrome.storage.sync.set({ 'librusOptionsDefaultWeight': librusOptionsDefaultWeightInput.value });
	});

	librusOptionsUseWeightsCheckbox.addEventListener('change', () => {
		if (librusOptionsUseWeightsCheckbox.checked) {
			chrome.storage.sync.set({ 'librusOptionsUseWeights': true });
		} else {
			chrome.storage.sync.set({ 'librusOptionsUseWeights': false });
		}
	});
	librusOptionsRespectPolicyCheckbox.addEventListener('change', () => {
		if (librusOptionsRespectPolicyCheckbox.checked) {
			chrome.storage.sync.set({ 'librusOptionsRespectPolicy': true });
		} else {
			chrome.storage.sync.set({ 'librusOptionsRespectPolicy': false });
		}
	});
	librusOptionsCountZerosCheckbox.addEventListener('change', () => {
		if (librusOptionsCountZerosCheckbox.checked) {
			chrome.storage.sync.set({ 'librusOptionsCountZeros': true });
		} else {
			chrome.storage.sync.set({ 'librusOptionsCountZeros': false });
		}
	});

	chrome.storage.sync.get(['librusOptionsUseWeights', 'librusOptionsRespectPolicy', 'librusOptionsCountZeros', 'librusOptionsPositiveFraction', 'librusOptionsNegativeFraction', 'librusOptionsDefaultWeight'], (result) => {
		if (result.librusOptionsUseWeights == true) {
			librusOptionsUseWeightsCheckbox.checked = true;
		}
		if (result.librusOptionsRespectPolicy == true) {
			librusOptionsRespectPolicyCheckbox.checked = true;
		}
		if (result.librusOptionsCountZeros == true) {
			librusOptionsCountZerosCheckbox.checked = true;
		}

		if (result.librusOptionsPositiveFraction == "") {
			librusOptionsPositiveFractionInput.value = 0.5;
			chrome.storage.sync.set({ 'librusOptionsPositiveFraction': 0.5 });
		}
		if (result.librusOptionsNegativeFraction == "") {
			librusOptionsNegativeFractionInput.value = 0.25;
			chrome.storage.sync.set({ 'librusOptionsNegativeFraction': 0.25 });
		}
		if (result.librusOptionsDefaultWeight == "") {
			librusOptionsDefaultWeightInput.value = 1;
			chrome.storage.sync.set({ 'librusOptionsDefaultWeight': 1 });
		}

		librusOptionsPositiveFractionInput.value = !isNaN(result.librusOptionsPositiveFraction) ? result.librusOptionsPositiveFraction : 0.5;
		librusOptionsNegativeFractionInput.value = !isNaN(result.librusOptionsNegativeFraction) ? result.librusOptionsNegativeFraction : 0.25;
		librusOptionsDefaultWeightInput.value = !isNaN(result.librusOptionsDefaultWeight) ? result.librusOptionsDefaultWeight : 1;
	});

});

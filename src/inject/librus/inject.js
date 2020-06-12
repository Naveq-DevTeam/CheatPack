chrome.storage.sync.get(['librusCheat'], (result) => {
	if (result.librusCheat) {

		/**
		 * Librus Cheat Script written by RouNNdeL (https://github.com/RouNNdeL/) with modifications by Naveq (https://github.com/Naveq) to work with Naveq-CheatPack
		 * @author RouNNdeL
		 */

		const SETTINGS = ['librusOptionsUseWeights', 'librusOptionsRespectPolicy', 'librusOptionsCountZeros', 'librusOptionsPositiveFraction', 'librusOptionsNegativeFraction', 'librusOptionsDefaultWeight'];

		const REGEX_WEIGHT = /Waga: (\d+)/;
		const REGEX_MARK = /(\d)([+-]?)/;
		const REGEX_POLICY = /Licz do średniej:\s*(tak|nie)/;

		const REGEX_FIRST_TERM_MARKS = /Oceny bieżące/i;
		const REGEX_FIRST_TERM_AVERAGE = /ocen.*pierwszego okresu/i;
		const REGEX_SECOND_TERM_MARKS = /Oceny bieżące/i;
		const REGEX_SECOND_TERM_AVERAGE = /ocen.*drugiego okresu/i;
		const REGEX_YEAR_AVERAGE = /średnia roczna/i;

		const POLICY_POSITIVE = "tak";

		/**
		 * Librus sometimes hides unnecessary columns, so we need to dynamically check what they are
		 * @type {{firstTermMarks: number, firstTermAverage: number, secondTermMarks: number, secondTermAverage: number, yearAverage: number}}
		 */
		const DEFAULT_COLUMN_NUMBERS = {
			firstTermMarks: 2,
			firstTermAverage: 3,
			secondTermMarks: 6,
			secondTermAverage: 7,
			yearAverage: 9,
		};

		THEAD_COLUMN_OFFSET = 2; //The columns in the head row are offset by 2 compared to the subject rows

		//Default Settings
		const PLUS_WEIGHT = 0.5;
		const MINUS_WEIGHT = 0.25;
		const DEFAULT_WEIGHT = 1;
		const RESPECT_POLICY = true;
		const USE_WEIGHTS = true;
		const ZERO_AVG = false;

		/**
		 * This is an example of a settings object
		 * @typedef {Object}
		 * @property {number} librusOptionsPositiveFraction the fraction that will be added to a grade with a plus
		 * @property {number} librusOptionsNegativeFraction the fraction that will be subtracted from a grade with a minus
		 * @property {number} librusOptionsDefaultWeight weight that will be assigned to a grade with no weight
		 * @property {boolean} librusOptionsRespectPolicy whether to count grades marked as 'Do not count toward the average'
		 * @property {boolean} librusOptionsUseWeights whether to use weights at all
		 */
		const DEFAULT_SETTINGS = {
			librusOptionsPositiveFraction: PLUS_WEIGHT,
			librusOptionsNegativeFraction: MINUS_WEIGHT,
			librusOptionsDefaultWeight: DEFAULT_WEIGHT,
			librusOptionsRespectPolicy: RESPECT_POLICY,
			librusOptionsUseWeights: USE_WEIGHTS,
			librusOptionsCountZeros: ZERO_AVG
		};

		/**
		 * Loads settings from Chrome's sync storage, if no settings are found returns default settings and saves them
		 * @param {function} callback function to receive the settings
		 * @see DEFAULT_SETTINGS
		 */
		function loadSettings(callback) {
			chrome.storage.sync.get(SETTINGS, function (items) {
				let settings;
				if (items === undefined) {
					settings = DEFAULT_SETTINGS;
					saveSettings(settings);
				} else {
					items.librusOptionsDefaultWeight = parseInt(items.librusOptionsDefaultWeight, 10);
					items.librusOptionsPositiveFraction = parseFloat(items.librusOptionsPositiveFraction, 10);
					items.librusOptionsNegativeFraction = parseFloat(items.librusOptionsNegativeFraction, 10);
					settings = items;
				}
				if (settings === undefined || settings === null) {
					settings = DEFAULT_SETTINGS;
					saveSettings(settings);
				}

				if (settings.librusOptionsDefaultWeight === null || settings.librusOptionsDefaultWeight === undefined || isNaN(settings.librusOptionsDefaultWeight))
					settings.librusOptionsDefaultWeight = DEFAULT_WEIGHT;

				if (settings.librusOptionsPositiveFraction === null || settings.librusOptionsPositiveFraction === undefined || isNaN(settings.librusOptionsPositiveFraction))
					settings.librusOptionsPositiveFraction = PLUS_WEIGHT;

				if (settings.librusOptionsNegativeFraction === null || settings.librusOptionsNegativeFraction === undefined || isNaN(settings.librusOptionsNegativeFraction))
					settings.librusOptionsNegativeFraction = MINUS_WEIGHT;

				if (settings.librusOptionsRespectPolicy === null || settings.librusOptionsRespectPolicy === undefined)
					settings.librusOptionsRespectPolicy = RESPECT_POLICY;

				if (settings.librusOptionsUseWeights === null || settings.librusOptionsUseWeights === undefined)
					settings.librusOptionsUseWeights = USE_WEIGHTS;

				if (settings.librusOptionsCountZeros === null || settings.librusOptionsCountZeros === undefined)
					settings.librusOptionsCountZeros = ZERO_AVG;

				callback(settings);
			});
		}

		/**
		 * Saves provided settings to Chrome's sync storage
		 * @param {object} settings to save
		 * @param {function} [callback] passed to {@link chrome.storage.sync.set()}
		 * @see DEFAULT_SETTINGS
		 */
		function saveSettings(settings, callback) {
			if (typeof callback === "function") {
				const obj = {};
				obj[SETTINGS] = settings;
				chrome.storage.sync.set(obj, callback);
			}
			else {
				const obj = {};
				obj[SETTINGS] = settings;
				chrome.storage.sync.set(obj);
			}
		}

		/**
		 * Resets the settings to their default values
		 * @param {function} [callback] passed to {@link chrome.storage.sync.set()}
		 * @see DEFAULT_SETTINGS
		 */
		function clearSettings(callback) {
			if (typeof callback === "function") {
				const obj = {};
				obj[SETTINGS] = DEFAULT_SETTINGS;
				chrome.storage.sync.set(obj, callback);
			}
			else {
				const obj = {};
				obj[SETTINGS] = DEFAULT_SETTINGS;
				chrome.storage.sync.set(obj);
			}
		}

		let columnNumbers = DEFAULT_COLUMN_NUMBERS;
		let start_time;

		$(function () {
			start_time = Date.now();
			loadSettings(function (settings) {
				columnNumbers = getColumnNumbers();
				setup(settings);
			});
			registerOnChangedListener();
		});

		/**
		 * A simple object tah represents a grade/mark
		 * @param mark
		 * @param weight
		 * @constructor
		 */
		function Mark(mark, weight) {
			this.mark = mark;
			this.weight = weight;
		}

		/**
		 * An object containing an array of {@link Mark Marks} and also offering some other functionality
		 * (ex. {@link MarkList.getAverage getAverage()});
		 * @param {Mark[]} markList an array of {@link Mark Marks} to create the object from
		 * @constructor
		 */
		function MarkList(markList) {
			if (markList === undefined)
				this.markList = [];
			else
				this.markList = markList;

			/**
			 * Calculates a weighted average of all {@link Mark Marks} in the markList
			 * @returns {number} weighted average
			 */
			this.getAverage = function (zeros = false) {
				let markSum = 0;
				let weightSum = 0;

				for (let i = 0; i < this.markList.length; i++) {
					if (zeros || this.markList[i].mark > 0) {
						markSum += this.markList[i].mark * this.markList[i].weight;
						weightSum += this.markList[i].weight;
					}
				}

				return weightSum !== 0 ? markSum / weightSum : 0;
			};

			this.getLength = function () {
				return this.markList.length;
			};

			/**
			 * Creates a new {@link MarkList} object that contains {@link Mark Marks} from <code>this</code> and the provided {@link MarkList}
			 * @param {MarkList} list to be concatenated with <code>this</code>
			 * @returns {MarkList} a new object containing all marks
			 */
			this.concat = function (list) {
				return new MarkList(this.markList.concat(list.markList));
			};
		}

		/**
		 * Registers a {@link  chrome.storage.onChanged} listener to update the averages when the settings change
		 */
		function registerOnChangedListener() {
			//noinspection JSUnusedLocalSymbols
			chrome.storage.onChanged.addListener(function (changes, namespace) {
				for (let key in changes) {
					if (key === SETTINGS) {
						setup(changes[SETTINGS]["newValue"])
					}
				}
			});
		}

		/**
		 * This function allows a regex selector for jQuery
		 * @param elem
		 * @param index
		 * @param match
		 * @returns {boolean}
		 */
		jQuery.expr[':'].regex = function (elem, index, match) {
			const matchParams = match[3].split(','),
				validLabels = /^(data|css):/,
				attr = {
					method: matchParams[0].match(validLabels) ?
						matchParams[0].split(':')[0] : 'attr',
					property: matchParams.shift().replace(validLabels, '')
				},
				regexFlags = 'ig',
				regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);

			return regex.test(jQuery(elem)[attr.method](attr.property));
		};

		/**
		 * Convenient function to check whether certain params match a given regex
		 * @param {object} column
		 * @param {RegExp} regex
		 * @returns {boolean} true if matches
		 */
		function columnMatches(column, regex) {
			return regex.exec(column.text()) !== null ||
				regex.exec(column.attr("title")) !== null;
		}

		/**
		 * Dynamically fetches column numbers for required fields
		 * @returns {{firstTermMarks: number, firstTermAverage: number, secondTermMarks: number, secondTermAverage: number, yearAverage: number}}
		 * @see DEFAULT_COLUMN_NUMBERS
		 */
		function getColumnNumbers() {
			const columns = $("table.decorated.stretch").find("thead")
				.find("tr").eq(1).find("td");
			const columnNumbers = {};
			columns.each(function (i) {
				const offsetColumnNumber = i + THEAD_COLUMN_OFFSET;
				if (columnMatches($(this), REGEX_FIRST_TERM_MARKS) &&
					columnNumbers.firstTermMarks === undefined) {
					columnNumbers.firstTermMarks = offsetColumnNumber;
				}
				else if (columnMatches($(this), REGEX_FIRST_TERM_AVERAGE) &&
					columnNumbers.firstTermAverage === undefined) {
					columnNumbers.firstTermAverage = offsetColumnNumber;
				}
				else if (columnMatches($(this), REGEX_SECOND_TERM_MARKS) &&
					columnNumbers.secondTermMarks === undefined) {
					columnNumbers.secondTermMarks = offsetColumnNumber;
				}
				else if (columnMatches($(this), REGEX_SECOND_TERM_AVERAGE) &&
					columnNumbers.secondTermAverage === undefined) {
					columnNumbers.secondTermAverage = offsetColumnNumber;
				}
				else if (columnMatches($(this), REGEX_YEAR_AVERAGE) &&
					columnNumbers.yearAverage === undefined) {
					columnNumbers.yearAverage = offsetColumnNumber;
				}
			});

			return columnNumbers;
		}

		/**
		 * Used to grab marks from a single row and column in that row.
		 * @param {object} row an element that represents a single subject grabbed with jQuery from the subject table
		 * @param {number} column index of the column in said table
		 * @param {object} [settings = DEFAULT_SETTINGS] used to check for the weights, and the policy
		 * @returns {MarkList|boolean} for a single subject in a single school term or false when no grade boxes where found
		 * @see DEFAULT_SETTINGS
		 */
		function getMarks(row, column, settings = DEFAULT_SETTINGS) {
			let marks = new MarkList();
			let anyGrade = false;

			$(row).find("td").eq(column).find("span.grade-box  a").each(function () {
				anyGrade = true;
				let rawMark = $(this).text();
				let markDescription = $(this).attr("title");
				let markMatch = rawMark.match(REGEX_MARK);
				let weightMatch = markDescription.match(REGEX_WEIGHT);
				let policyMatch = markDescription.match(REGEX_POLICY);
				let weight = settings.librusOptionsUseWeight ? weightMatch !== null ? parseInt(weightMatch[1]) : settings.librusOptionsDefaultWeight : 1;

				let policy = policyMatch !== null ? policyMatch[1] : POLICY_POSITIVE;

				if (markMatch !== null && (!settings.librusOptionsRespectPolicy || policy === POLICY_POSITIVE)) {
					let mark = parseInt(markMatch[1]);
					if (markMatch[2] === "+")
						mark += settings.librusOptionsPositiveFraction;
					else if (markMatch[2] === "-")
						mark -= settings.librusOptionsNegativeFraction;
					marks.markList.push(new Mark(mark, weight));
				}
			});

			return anyGrade ? marks : false;
		}

		/**
		 * Performs the whole setup. Using a selector goes through every single row and using {@link getMarks}
		 * receives 2 {@link MarkList MarksLists} for both terms and then displays the average
		 * calculated by {@link MarkList.getAverage} in the corresponding columns
		 * @param {object} [settings = DEFAULT_SETTINGS] settings that are going to be used in the setup
		 * @see DEFAULT_SETTINGS
		 */
		function setup(settings = DEFAULT_SETTINGS) {
			// Those are rows corresponding to a subject
			//noinspection CssInvalidPseudoSelector, UnexpectedToken
			let line = 0;
			$("div.container-background > table.decorated.stretch > tbody > tr:regex(class, line[0,1])")
				.not("tr:regex(name, przedmioty_all)").not(".bolded")
				.each(function () {
					let firstTermMarks = getMarks(this, columnNumbers.firstTermMarks, settings);
					let secondTermMarks = getMarks(this, columnNumbers.secondTermMarks, settings);
					let yearMarks;

					if (firstTermMarks === false && secondTermMarks === false) {
						yearMarks = false;
					}
					else {
						yearMarks = firstTermMarks !== false ?
							firstTermMarks.concat(secondTermMarks !== false ? secondTermMarks : new MarkList()) :
							secondTermMarks;
					}

					$(this).css("display", "");

					//Make sure the rows alter between line0 and line1 classes
					$(this).removeClass("line0 line1").addClass(`line${line}`);
					line = line === 1 ? 0 : 1;

					const firstTermCell = $(this).find("td").eq(columnNumbers.firstTermAverage);
					// Required, as Librus forgot to add that class for this cell
					firstTermCell.addClass("center");
					if (firstTermMarks !== false && firstTermMarks.getAverage(settings.librusOptionsCountZeros) > 0)
						firstTermCell.text(firstTermMarks.getAverage(settings.librusOptionsCountZeros).toFixed(2));
					else
						firstTermCell.text("-");

					const secondTermCell = $(this).find("td").eq(columnNumbers.secondTermAverage);
					// Not required, but we'll add the class just in case
					secondTermCell.addClass("center");
					if (secondTermMarks !== false && secondTermMarks.getAverage(settings.librusOptionsCountZeros) > 0)
						secondTermCell.text(secondTermMarks.getAverage(settings.librusOptionsCountZeros).toFixed(2));
					else
						secondTermCell.text("-");

					const yearCell = $(this).find("td").eq(columnNumbers.yearAverage);
					// Not required, but we'll add the class just in case
					yearCell.addClass("center");
					if (yearMarks !== false && yearMarks.getAverage(settings.librusOptionsCountZeros) > 0)
						yearCell.text(yearMarks.getAverage(settings.librusOptionsCountZeros).toFixed(2));
					else
						yearCell.text("-");
				});
		}
	}
});

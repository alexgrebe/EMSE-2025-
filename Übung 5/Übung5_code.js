let SEED = "666";
Nof1.SET_SEED(SEED);

let experiment_configuration_function = (writer) => {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const minKurzLength = 15;
    const maxKurzLength = 25;
    const minLangLength = 50;
    const maxLangLength = 70;
    const minVorkommen = 1;
    const maxVorkommen = 9;

    function generateRandomString(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        return result;
    }

    return {
        experiment_name: "Kontrollierte_Textgenerierung",
        seed: SEED,

        introduction_pages: writer.stage_string_pages_commands([
            writer.convert_string_to_html_string(
                "Bitte zählen Sie die Anzahl des hervorgehobenen Buchstabens im angezeigten Text."),
            writer.convert_string_to_html_string(
                "Geben Sie die Anzahl als Ziffer (1-9) ein.")
        ]),

        pre_run_training_instructions: writer.string_page_command(
            writer.convert_string_to_html_string(
                "Sie beginnen mit einer kurzen Trainingsphase."
            )),

        pre_run_experiment_instructions: writer.string_page_command(
            writer.convert_string_to_html_string(
                "Nun beginnt die eigentliche Experimentierphase."
            )),

        finish_pages: [
            writer.string_page_command(
                writer.convert_string_to_html_string(
                    "Das Experiment ist beendet. Vielen Dank für Ihre Teilnahme!"
                )
            )
        ],

        layout: [
            { variable: "Textfarbe", treatments: ["Schwarz", "Hervorgehoben"] },
            { variable: "Textlänge", treatments: ["Kurz", "Lang"] }
        ],

        training_configuration: {
            fixed_treatments: [
                ["Textfarbe", "Schwarz"],
                ["Textlänge", "Kurz"]
            ],
            can_be_cancelled: false,
            can_be_repeated: 3
        },

        repetitions: 5,

        measurement: Nof1.Reaction_time(Nof1.keys(["1", "2", "3", "4", "5", "6", "7", "8", "9"])),

        task_configuration: (t) => {
            writer.clear_stage();

            const textfarbe = t.treatment_combination[0].value;
            const textlaenge = t.treatment_combination[1].value;

            let basisText = "";
            let zuZaehlendesZeichen = "";
            let korrekteAnzahl = "0";
            let versuche = 0;
            const maxVersuche = 20; // Erhöhte Versuche

            while (versuche < maxVersuche) {
                const gewuenschteLaenge = (textlaenge === "Kurz")
                    ? Math.floor(Math.random() * (maxKurzLength - minKurzLength + 1)) + minKurzLength
                    : Math.floor(Math.random() * (maxLangLength - minLangLength + 1)) + minLangLength;

                basisText = generateRandomString(gewuenschteLaenge);
                zuZaehlendesZeichen = alphabet[Math.floor(Math.random() * alphabet.length)];
                const regex = new RegExp(zuZaehlendesZeichen, 'g');
                const anzahlImText = (basisText.match(regex) || []).length;

                if (anzahlImText >= minVorkommen && anzahlImText <= maxVorkommen) {
                    korrekteAnzahl = anzahlImText.toString();
                    break;
                }
                versuche++;
            }

            // Fallback, falls die Kriterien nach mehreren Versuchen nicht erfüllt werden konnten
            if (korrekteAnzahl === "0") {
                const gewuenschteLaenge = (textlaenge === "Kurz") ? 20 : 60;
                basisText = generateRandomString(gewuenschteLaenge);
                zuZaehlendesZeichen = alphabet[Math.floor(Math.random() * alphabet.length)];
                const anzahlImText = Math.floor(Math.random() * (maxVorkommen - minVorkommen + 1)) + minVorkommen;
                for (let i = 0; i < anzahlImText; i++) {
                    const zufallsIndex = Math.floor(Math.random() * basisText.length);
                    basisText = basisText.substring(0, zufallsIndex) + zuZaehlendesZeichen + basisText.substring(zufallsIndex + 1);
                }
                korrekteAnzahl = anzahlImText.toString();
            }

            let anzuzeigenderText = basisText;
            if (textfarbe === "Hervorgehoben") {
                const hervorhebungsFarbe = "blue";
                const regexHighlight = new RegExp(zuZaehlendesZeichen, 'g');
                anzuzeigenderText = basisText.replace(regexHighlight, `<span style="color: ${hervorhebungsFarbe}; font-weight: bold;">${zuZaehlendesZeichen}</span>`);
            }

            t.correct_answer = korrekteAnzahl;

            t.do_print_task = () => {
                writer.clear_stage();
                const htmlText = `<div style="font-size: 1.2em; line-height: 1.5; word-break: break-word;">${anzuzeigenderText}</div>`;
                const frage = `<p style="font-size: 1.2em;">Wie oft ist der Buchstabe <span style="font-weight: bold;">${zuZaehlendesZeichen.toUpperCase()}</span> vorhanden?</p>`;
                writer.print_html_on_stage(htmlText + "<br><br>" + frage);
            };

            t.expected_answer = t.correct_answer;

            t.accepts_answer_function = (given_answer) => {
                return given_answer.trim() === t.correct_answer;
            };

            t.do_print_error_message = (given_answer) => {
                writer.clear_error();
                writer.print_html_on_error(`<p style="color: red;">Falsche Antwort. Bitte zählen Sie den hervorgehobenen Buchstaben "${zuZaehlendesZeichen.toUpperCase()}" sorgfältig und geben Sie die Anzahl ein.</p>`);
            };

            t.do_print_after_task_information = (given_answer) => {
                writer.clear_error();
                writer.print_string_on_stage(writer.convert_string_to_html_string(
                    `Ihre Antwort: ${given_answer}, Richtige Antwort: ${t.expected_answer}\nDrücken Sie [Enter], um fortzufahren.`));
            };
        }
    };
};

Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);
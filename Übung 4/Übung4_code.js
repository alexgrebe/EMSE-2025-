let SEED = "666";
Nof1.SET_SEED(SEED);

let experiment_configuration_function = (writer) => {
    return {
        experiment_name: "TestExperiment",
        seed: SEED,

        introduction_pages: writer.stage_string_pages_commands([
            writer.convert_string_to_html_string(
                "Bitte führe dieses Experiment nur aus, wenn du konzentriert bist."),
            writer.convert_string_to_html_string(
                "In diesem Experiment wirst du gebeten, die Zahl des angefragten Buchstabens einzugeben.")
        ]),

        pre_run_training_instructions: writer.string_page_command(
            writer.convert_string_to_html_string(
                "Du hast die Trainingsphase betreten."
            )),

        pre_run_experiment_instructions: writer.string_page_command(
            writer.convert_string_to_html_string(
                "Du hast die Experimentierphase betreten.\n\n"
            )),

        finish_pages: [
            writer.string_page_command(
                writer.convert_string_to_html_string(
                    "Fast fertig. Als Nächstes werden die Experimentdaten heruntergeladen. Bitte sende die " +
                    "heruntergeladene Datei an den Experimentator.\n\nNach dem Senden deiner E-Mail kannst du dieses Fenster schließen.\n\nVielen Dank für deine Teilnahme am Experiment."
                )
            )
        ],

        layout: [
            { variable: "CodeFormat", treatments: ["Leerzeilen", "Kompakt"] },
            { variable: "TextAlign", treatments: ["Links", "Zufällige_Positionierung"] }
        ],

        training_configuration: {
            fixed_treatments: [
                ["CodeFormat", "Leerzeilen"],
                ["TextAlign", "Links"]
            ],
            can_be_cancelled: false,
            can_be_repeated: false
        },

        repetitions: 8,

        measurement: Nof1.Reaction_time(Nof1.keys(["1", "2", "3", "4", "5", "6", "7", "8", "9"])),

        task_configuration: (t) => {
            writer.clear_stage();

            const used_letters = [];
            const letter_value_map = {};

            // 9 zufällige Buchstaben generieren
            while (used_letters.length < 9) {
                let char = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
                if (!used_letters.includes(char)) {
                    used_letters.push(char);
                    letter_value_map[char] = Math.floor(Math.random() * 9) + 1;
                }
            }

            const target_letter = used_letters[Math.floor(Math.random() * used_letters.length)];
            const correct_answer = letter_value_map[target_letter];

            t.correct_answer = correct_answer.toString();
            t.target_letter = target_letter;

            t.do_print_task = () => {
                writer.clear_stage();

                const spacing_mode = t.treatment_combination[0].value;
                const text_align_mode = t.treatment_combination[1].value;

                // Berechne die benötigte Höhe des Containers dynamisch
                // Es gibt 9 Zeilen Code.
                // Grundhöhe pro Zeile (ca. 1.2em oder 15-20px)
                // Bei "Kompakt": ca. 15px pro Zeile
                // Bei "Leerzeilen": ca. 45px pro Zeile
                const line_height_compact = 15;
                const line_height_leerzeilen = 45;
                let required_height = 0;

                if (spacing_mode === "Leerzeilen") {
                    required_height = 9 * line_height_leerzeilen + 50; // 50px Puffer
                } else { // Kompakt
                    required_height = 9 * line_height_compact + 50; // 50px Puffer
                }

                // Verwende die berechnete Höhe für den Container
                let code_html = `<div style="position: relative; width: 100%; height: ${required_height}px; overflow: hidden;">`;

                let current_top_position = 0;

                for (let l of used_letters) {
                    let line_content = `let ${l} = ${letter_value_map[l]};`;
                    let line_style = "";

                    if (text_align_mode === "Zufällige_Positionierung") {
                        // Max. Breite des Inhalts (ca. 18 Zeichen für "let x = 1;") * (Durchschnittliche Zeichenbreite, z.B. 0.6em oder 10px)
                        // Das ist eine Schätzung, um zu vermeiden, dass der Text rechts überläuft.
                        // 100% - (max_chars * char_width_px)
                        // Wenn der Text z.B. 100px breit ist, und der Bildschirm 500px, dann ist max_left 400px.
                        // Für 70% der Breite des Containers, mit einem Puffer von 10% am rechten Rand: 0 bis 60%
                        const max_random_left_percent = 70; // Maximale Startposition in Prozent von links
                        const random_left = Math.floor(Math.random() * (max_random_left_percent + 1)); // 0 bis max_random_left_percent
                        line_style = `position: absolute; left: ${random_left}%; top: ${current_top_position}px;`;
                    } else {
                        line_style = `position: relative; left: 0;`;
                    }

                    code_html += `<div style="${line_style} white-space: pre;">${line_content}</div>`;

                    if (spacing_mode === "Leerzeilen") {
                        current_top_position += line_height_leerzeilen;
                    } else {
                        current_top_position += line_height_compact;
                    }
                }

                code_html += `</div>`;

                code_html += `<br><br><p><strong>Frage:</strong> Welchen Wert hat <code>${target_letter}</code>?</p>`;

                writer.print_html_on_stage(code_html);
            };

            t.expected_answer = t.correct_answer;

            t.accepts_answer_function = (given_answer) => {
                return true;
            };

            t.do_print_error_message = (given_answer) => {
                writer.clear_error();
                writer.print_html_on_error("<p>Falsche Antwort: " + given_answer + "</p>");
            };

            t.do_print_after_task_information = (given_answer) => {
                writer.clear_error();
                writer.print_string_on_stage(writer.convert_string_to_html_string(
                    "Richtige Antwort: " + t.expected_answer + "\n" + "Drücken Sie [Enter], um fortzufahren."));
            };
        }
    };
};

Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);
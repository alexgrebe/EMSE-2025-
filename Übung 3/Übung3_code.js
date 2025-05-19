let SEED = "666";
Nof1.SET_SEED(SEED);

let experiment_configuration_function = (writer) => { return {

    experiment_name: "TestExperiment",
    seed: SEED,

    introduction_pages: writer.stage_string_pages_commands([
        writer.convert_string_to_html_string(
            "Please, just do this experiment only, if you are concentrated"),
        writer.convert_string_to_html_string(
            "In this experiment, you will be asked to put in the Number of the Letter, that is asked")
    ]),

    pre_run_training_instructions: writer.string_page_command(
        writer.convert_string_to_html_string(
            "You entered the training phase."
        )),

    pre_run_experiment_instructions: writer.string_page_command(
        writer.convert_string_to_html_string(
            "You entered the experiment phase.\n\n"
        )),

    finish_pages: [
        writer.string_page_command(
            writer.convert_string_to_html_string(
                "Almost done. Next, the experiment data will be downloaded. Please, send the " +
                "downloaded file to the experimenter.\n\nAfter sending your email, you can close this window.\n\nMany thanks for participating in the experiment."
            )
        )
    ],

    //variable bspw code highlight , treatments sind bspw mit code highlight und ohne
    layout: [
        { variable: "CodeFormat",  treatments: ["Leerzeilen", "Kompakt"]},
    ],

    training_configuration: {
        fixed_treatments:               [
            ["CodeFormat", "Leerzeilen"]
        ],
        can_be_cancelled: false,
        can_be_repeated: false
    },

    repetitions: 20,
//auf welche tasten soll das programm reagieren
    measurement: Nof1.Reaction_time(Nof1.keys(["1", "2", "3","4","5","6","7","8","9"])),

    task_configuration:    (t) => {

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

        // Zufällige Auswahl für die spätere Abfrage
        const target_letter = used_letters[Math.floor(Math.random() * used_letters.length)];
        const correct_answer = letter_value_map[target_letter];

        t.correct_answer = correct_answer.toString();
        t.target_letter = target_letter;

        t.do_print_task = () => {
            writer.clear_stage();

            // Treatment: mit oder ohne Leerzeilen
            const spacing_mode = t.treatment_combination[0].value; // z.B. "leerzeilen" oder "kompakt"

            // Codeblock als HTML erzeugen
            let code_html = "<pre class='sourcecode'>";
            for (let l of used_letters) {
                code_html += `let ${l} = ${letter_value_map[l]};`;
                code_html += (spacing_mode === "Leerzeilen") ? "\n\n\n" : "\n";
            }
            code_html += "</pre><br><br>";
            code_html += `<p><strong>Frage:</strong> Welchen Wert hat <code>${target_letter}</code>?</p>`;

            writer.print_html_on_stage(code_html);
        };

        t.expected_answer = t.correct_answer;

        t.accepts_answer_function = (given_answer) => {
            // return given_answer.trim() === t.correct_answer;
            return true;

        };

        t.do_print_error_message = (given_answer) => {
            writer.clear_error();
            writer.print_html_on_error("<p>Falsche Antwort: " + given_answer + "</p>");
        };

        t.do_print_after_task_information = (given_answer) => {
            writer.clear_error();
            writer.print_string_on_stage(writer.convert_string_to_html_string(
                "Richtige antwort:" + t.expected_answer + "\n" + "Drücken Sie [Enter], um fortzufahren."));
        }
    }
}};

Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);

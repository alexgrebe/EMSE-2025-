let SEED = "666";
Nof1.SET_SEED(SEED);

let experiment_configuration_function = (writer) => { return {

    experiment_name: "AbbreviationsExperiment",
    seed: SEED,

    introduction_pages: writer.stage_string_pages_commands([
        writer.convert_string_to_html_string(
            "In this experiment you will be asked to perform mental calculations based on different variable naming conventions."),
        writer.convert_string_to_html_string(
            "Your goal is to calculate the correct final price based on given parameters. The variable names may be descriptive or abbreviated.")
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

    layout: [
        { variable: "names",  treatments: ["descriptive_names", "short_names"]},
    ],

    training_configuration: {
        fixed_treatments:               [
            ["Dummy", "X"]
        ],
        can_be_cancelled: false,
        can_be_repeated: false
    },

    repetitions: 5,

    measurement: Nof1.Reaction_time(Nof1.keys(["1", "2", "3", "9"])),

    task_configuration:    (t) => {

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function getRandomFloat(min, max) {
            return Math.random() * (max - min) + min;
        }
        if (names === "descriptive_names") {
            let basePrice = getRandomInt(1, 50);
            let discount = getRandomFloat(0.1, 0.9);
            let quantity = getRandomInt(1, 10);
            let taxRate = 0.2;

            function calculateFinalPrice(basePrice, discount, quantity, taxRate) {
                let subtotal = basePrice * quantity;
                let totalWithDiscount = subtotal * (1 - discount);
                let tax = totalWithDiscount * taxRate;
                let finalPrice = totalWithDiscount + tax;
                return finalPrice;
            }

            let expectedAnswer = calculateFinalPrice(basePrice, discount, quantity, taxRate);

            t.expected_answer = expectedAnswer.toFixed(2);

            t.do_print_task = () => {
                writer.clear_stage();
                writer.print_string_on_stage(writer.convert_string_to_html_string(
                    "Calculate the final price based on the following:<br><br>" +
                    "<strong>basePrice</strong> = " + basePrice + "<br>" +
                    "<strong>discount</strong> = " + discount.toFixed(1) + "<br>" +
                    "<strong>quantity</strong> = " + quantity + "<br>" +
                    "<strong>taxRate</strong> = " + taxRate + "<br><br>" +
                    "Formula:<br>" +
                    "subtotal = basePrice * quantity<br>" +
                    "totalWithDiscount = subtotal * (1 - discount)<br>" +
                    "tax = totalWithDiscount * taxRate<br>" +
                    "finalPrice = totalWithDiscount + tax"
                ));
            };
        }
        t.do_print_task = () => {
            writer.clear_stage();
            writer.print_html_on_stage("<div class='sourcecode'>Hi, this is some source code, enter abc </div>");
        };

        t.expected_answer = "abc";

        t.accepts_answer_function = (given_answer) => {
            return true;
        };

        t.do_print_error_message = (given_answer) => {
            writer.clear_stage();
            writer.clear_error();
            writer.print_html_on_error("<h1>Invalid answer: " + given_answer + "");
        };

        t.do_print_after_task_information = () => {
            writer.clear_error();
            writer.print_string_on_stage(writer.convert_string_to_html_string(
                "Correct.\n\n" +
                "In case, you feel not concentrated enough, make a short break.\n\n" +
                "Press [Enter] to go on. "));
        }
    }
}};

Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);

let SEED = "666";
Nof1.SET_SEED(SEED);

let experiment_configuration_function = (writer) => {
    return {
        experiment_name: "Abbreviations Experiment",
        seed: SEED,

        introduction_pages: writer.stage_string_pages_commands([
            writer.convert_string_to_html_string(
                "In this experiment you will be asked to perform mental calculations based on different variable naming conventions."),
            writer.convert_string_to_html_string(
                "Your goal is to calculate the correct final price based on given parameters. The variable names may be descriptive or abbreviated.")
        ]),

        pre_run_training_instructions: writer.string_page_command(
            writer.convert_string_to_html_string("You are now entering the training phase.")
        ),

        pre_run_experiment_instructions: writer.string_page_command(
            writer.convert_string_to_html_string("You are now entering the experiment phase.")
        ),

        finish_pages: [
            writer.string_page_command(
                writer.convert_string_to_html_string(
                    "Almost done. Next, the experiment data will be downloaded. Please, send the " +
                    "downloaded file to the experimenter.\n\nAfter sending your email, you can close this window.\n\nMany thanks for participating in the experiment."
                )
            )
        ],

        layout: [
            { variable: "names", treatments: ["descriptive_names", "short_names"] }
        ],

        training_configuration: {
            fixed_treatments: [["Dummy", "X"]],
            can_be_cancelled: false,
            can_be_repeated: false
        },

        repetitions: 5,

        measurement: Nof1.Text_input(),

        tasks: [
            {
                task_configuration: (t) => {
                    let names = t.treatments("names");

                    function getRandomInt(min, max) {
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    }

                    function getRandomFloat(min, max) {
                        return Math.random() * (max - min) + min;
                    }

                    // Descriptive Version
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

                    // Short Name Version
                    if (names === "short_names") {
                        let a = getRandomInt(1, 50);
                        let b = getRandomFloat(0.1, 0.9);
                        let c = getRandomInt(1, 10);
                        let d = 0.2;

                        function f(a, b, c, d) {
                            let e = a * c;
                            let g = e * (1 - b);
                            let h = g * d;
                            let j = g + h;
                            return j;
                        }

                        let expectedAnswer = f(a, b, c, d);

                        t.expected_answer = expectedAnswer.toFixed(2);

                        t.do_print_task = () => {
                            writer.clear_stage();
                            writer.print_string_on_stage(writer.convert_string_to_html_string(
                                "Calculate the final price based on the following:<br><br>" +
                                "<strong>a</strong> = " + a + "<br>" +
                                "<strong>b</strong> = " + b.toFixed(1) + "<br>" +
                                "<strong>c</strong> = " + c + "<br>" +
                                "<strong>d</strong> = " + d + "<br><br>" +
                                "Formula:<br>" +
                                "e = a * c<br>" +
                                "g = e * (1 - b)<br>" +
                                "h = g * d<br>" +
                                "j = g + h"
                            ));
                        };
                    }

                    t.accepts_answer_function = (given_answer) => {
                        return true; // Accept anything for now; evaluation can be done post-analysis
                    };

                    t.do_print_error_message = (given_answer) => {
                        writer.clear_stage();
                        writer.clear_error();
                        writer.print_html_on_error("<h1>Invalid answer: " + given_answer + "</h1>");
                    };

                    t.do_print_after_task_information = () => {
                        writer.clear_error();
                        writer.print_string_on_stage(writer.convert_string_to_html_string(
                            "Thank you.<br><br>If you need a short break, take it now.<br><br>Press [Enter] to continue."
                        ));
                    };
                }
            }
        ],
    };
};

Nof1.BROWSER_EXPERIMENT(experiment_configuration_function);

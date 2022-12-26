const SYMBOL = choice(
    // ":",
    // seq(".", /[^(){}\[\]"'~;,@`\s]*/),
    // /[^#(){}\[\]"'~;,@`.:\s][^(){}\[\]"'~;,@`.:\s]*/,
    /[a-zA-Z0-9-+=][a-zA-Z0-9-+=]*/,
);

surr = function(t) {
    return choice(
        seq("(", t, ")"),
        seq("[", t, "]"),
        seq("{", t, "}"),
        seq("<", t, ">"),
    );
};

module.exports = grammar({
    name: "crisp",

    word: ($) => $.symbol,

    extras: ($) => [/\s/, $.comment],

    conflicts: ($) => [
        // [$.sexpr],
        // [$.sexpr, $.let],
        // [$.let_bindings],
    ],

    rules: {
        program: ($) => repeat($._crisp),

        _crisp: ($) => choice($._special_form, $._literal, $.sexpr),

        /// S Expressions

        sexpr: ($) =>
            surr(
                seq(field("function", $._crisp), field("arguments", repeat($._crisp))),
            ),

        /// Literals

        _literal: ($) => choice($.integer, $.boolean, $.symbol/* , $.empty_tuple */),

        empty_tuple: ($) => surr(""),

        symbol: ($) => token(SYMBOL),

        integer: ($) => token(/[0-9][0-9]*/),

        boolean: ($) => choice("true", "false"),

        /// Special forms

        _special_form: ($) => choice($.fn, $.let, $.if),

        // fn

        fn: ($) =>
            surr(
                seq("fn", field("parameters", $.fn_parameters), field("body", $._crisp)),
            ),

        fn_parameters: ($) => surr(seq(repeat($._binding))),

        // let

        let: ($) =>
            surr(
                seq(
                    "let",
                    field("bindings", $.let_bindings),
                    field("body", repeat($._crisp)),
                ),
            ),

        let_bindings: ($) =>
            surr(
                seq(
                    repeat(
                        surr(seq($._binding, field("body", $._crisp))),
                    ),
                ),
            ),

        _binding: ($) => $.binding,

        binding: ($) => $.symbol,

        // if

        if: ($) =>
            surr(
                seq(
                    "if",
                    field("predicate", $._crisp),
                    field("true_branch", $._crisp),
                    field("false_branch", $._crisp),
                ),
            ),

        // others

        comment: ($) => token(seq(";;", /.*/)),
    },
});

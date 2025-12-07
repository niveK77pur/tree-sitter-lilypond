/**
 * @file LilyPond grammar for tree-sitter
 * @author niveK77pur <kevinbiewesch@yahoo.fr>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// Re-use existing lilypond-scheme work to parse embedded scheme
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const SchemeRules = require("./tree-sitter-lilypond/lilypond-scheme/rules.js");

export default grammar({
  name: "lilypond",

  extras: ($) => [/\s/, $.version_statement, $.comment, $.block_comment],

  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) => $.music,

    version_statement: ($) => seq("\\version", $.text),

    block_comment: (_) => seq("%{", repeat(choice(/./, /\n/, /\r/)), "%}"),
    comment: (_) => seq("%", /.*/),

    /** A music block */
    music: ($) => seq("{", repeat($._music_list), "}"),

    /** Items within a music block */
    _music_list: ($) =>
      choice(
        $.note,
        $.rest,
        $.time_signature_event,
        $.tempo_event,
        $.clef,
        $.bar_event,
        $.bar_check_event,
        $.bar_number_check,
        $.key_change_event,
        $.embedded_scheme,
      ),

    note: ($) =>
      seq(
        field("name", $.note_name),
        optional(field("octave", $.quotes)),
        optional(field("duration", $.steno_duration)),
      ),

    rest: ($) => seq("r", optional(field("duration", $.steno_duration))),

    /** Notes names and accidentals in different languages
     * See: https://lilypond.org/doc/v2.25/Documentation/notation/writing-pitches#note-names-in-other-languages
     * */
    //  {{{
    note_name: (_) =>
      choice(
        // nederlands
        seq(
          choice("c", "d", "e", "f", "g", "a", "bes", "b"),
          optional(choice("is", "es", "isis", "eses")),
        ),
        // TODO: Support other languages
        // // català
        // seq(
        //   choice("do", "re", "mi", "fa", "sol", "la", "sib", "si"),
        //   optional(choice("d", "s", "b", "dd", "ss", "bb")),
        // ),
        // // deutsch
        // seq(
        //   choice("c", "d", "e", "f", "g", "a", "b", "h"),
        //   optional(choice("is", "es", "isis", "eses")),
        // ),
        // // english
        // seq(
        //   choice("c", "d", "e", "f", "g", "a", "bf", "b-flat", "b"),
        //   optional(
        //     choice(
        //       "s",
        //       "-sharp",
        //       "f",
        //       "-flat",
        //       "ss",
        //       "x",
        //       "-sharpsharp",
        //       "ff",
        //       "-flatflat",
        //     ),
        //   ),
        // ),
        // // español
        // seq(
        //   choice("do", "re", "mi", "fa", "sol", "la", "sib", "si"),
        //   optional(choice("s", "b", "ss", "x", "bb")),
        // ),
        // // français
        // seq(
        //   choice("do", "ré", "re", "mi", "fa", "sol", "la", "sib", "si"),
        //   optional(choice("d", "b", "dd", "x", "bb")),
        // ),
        // // italiano
        // seq(
        //   choice("do", "re", "mi", "fa", "sol", "la", "sib", "si"),
        //   optional(choice("d", "b", "dd", "bb")),
        // ),
        // // norsk
        // seq(
        //   choice("c", "d", "e", "f", "g", "a", "b", "h"),
        //   optional(
        //     choice(
        //       "iss",
        //       "is",
        //       "ess",
        //       "es",
        //       "ississ",
        //       "isis",
        //       "essess",
        //       "eses",
        //     ),
        //   ),
        // ),
        // // português
        // seq(
        //   choice("do", "re", "mi", "fa", "sol", "la", "sib", "si"),
        //   optional(choice("s", "b", "ss", "bb")),
        // ),
        // // suomi
        // seq(
        //   choice("c", "d", "e", "f", "g", "a", "b", "h"),
        //   optional(choice("is", "es", "isis", "eses")),
        // ),
        // // svenska
        // seq(
        //   choice("c", "d", "e", "f", "g", "a", "b", "h"),
        //   optional(choice("iss", "ess", "ississ", "essess")),
        // ),
        // // vlaams
        // seq(
        //   choice("do", "re", "mi", "fa", "sol", "la", "sib", "si"),
        //   optional(choice("k", "b", "kk", "bb")),
        // ),
      ), //  }}}

    /**
     * The `quotes` relate to the octave marking attached to notes.
     * See: https://lilypond.org/doc/v2.25/Documentation/learning/pitches
     */
    quotes: (_) => choice(repeat1("'"), repeat1(",")),

    steno_duration: (_) => /[0-9]+\.*/,

    number: (_) => /[0-9]+/,
    text: (_) => /"[^"]*"/,

    /**
     * The beat structure that can be used for a time signature.
     * See: https://lilypond.org/doc/v2.25/Documentation/notation/displaying-rhythms.html#time-signature
     */
    beat_structure: ($) => seq($.number, repeat(seq(",", $.number))),

    time_signature_event: ($) =>
      seq(
        "\\time",
        optional(field("beatStructure", $.beat_structure)),
        choice(
          seq(
            field("numerator", $.number),
            "/",
            field("denominator", $.number),
          ),
          $.embedded_scheme,
        ),
      ),

    tempo_event: ($) =>
      seq(
        "\\tempo",
        choice(
          seq(
            optional(field("text", $.text)),
            field("duration", $.steno_duration),
            "=",
            field("tempo_range", $.tempo_range),
          ),
          seq(
            field("text", $.text),
            optional(
              seq(
                field("duration", $.steno_duration),
                "=",
                field("tempo_range", $.tempo_event),
              ),
            ),
          ),
        ),
      ),

    tempo_range: ($) => choice($.number, seq($.number, "-", $.number)),

    clef: ($) =>
      seq(
        "\\clef",
        optional('"'),
        $.clef_style,
        optional(choice($.clef_transpose, $.clef_optional_transpose)),
        optional('"'),
      ),

    /**
     * See: https://lilypond.org/doc/v2.25/Documentation/notation/clef-styles
     */
    //  {{{
    clef_style: (_) =>
      choice(
        // standard clefs
        "treble",
        "G",
        "G2",
        "treble",
        "violin",
        "french",
        "GG",
        "tenorG",
        "soprano",
        "mezzosoprano",
        "C",
        "alto",
        "tenor",
        "baritone",
        "varC",
        "altovarC",
        "tenorvarC",
        "baritonevarC",
        "varbaritone",
        "baritonevarF",
        "F",
        "bass",
        "subbass",
        // percussion clefs
        "percussion",
        "varpercussion",
        // tab clefs
        "tab",
        "moderntab",
        // ancient gregorian clefs
        "vaticana-do1",
        "vaticana-do2",
        "vaticana-do3",
        "vaticana-fa1",
        "vaticana-fa2",
        "medicaea-do1",
        "medicaea-do2",
        "medicaea-do3",
        "medicaea-fa1",
        "medicaea-fa2",
        "hufnagel-do1",
        "hufnagel-do2",
        "hufnagel-do3",
        "hufnagel-fa1",
        "hufnagel-fa2",
        "hufnagel-do-fa",
        // ancient mensural clefs
        "mensural-c1",
        "mensural-c2",
        "mensural-c3",
        "mensural-c4",
        "mensural-c5",
        "mensural-f",
        "mensural-f2",
        "mensural-f3",
        "mensural-f4",
        "mensural-f5",
        "mensural-g1",
        "mensural-g2",
        "mensural-g",
        "blackmensural-c1",
        "blackmensural-c2",
        "blackmensural-c3",
        "blackmensural-c4",
        "blackmensural-c5",
        "neomensural-c1",
        "neomensural-c2",
        "neomensural-c3",
        "neomensural-c4",
        "neomensural-c5",
        "petrucci-c1",
        "petrucci-c2",
        "petrucci-c3",
        "petrucci-c4",
        "petrucci-c5",
        "petrucci-f",
        "petrucci-f2",
        "petrucci-f3",
        "petrucci-f4",
        "petrucci-f5",
        "petrucci-g1",
        "petrucci-g2",
        "petrucci-g",
        // ancient kievan clefs
        "kievan-do",
      ), //  }}}

    clef_transpose: (_) => /[_^]\d+/,
    clef_optional_transpose: (_) => /[_^][\[(]\d+[\])]/,

    bar_event: ($) => seq("\\bar", field("type", $.text)),
    bar_check_event: (_) => "|",
    bar_number_check: ($) => seq("\\barNumberCheck", $.number),

    key_change_event: ($) =>
      seq("\\key", field("pitch", $.note_name), field("mode", $.mode)),
    /**
     * Mode for a key change event. It is possible to define custom modes, so
     * we cannot confidently list all possibilities
     */
    mode: (_) => /\\\w+/,

    ...SchemeRules, // External rules taken from submodule {{{
    // // Embedded Scheme: #(...) or $(...) with optional @ for splicing
    // embedded_scheme: ($) =>
    //   seq(alias(/[#$]@?/, $.embedded_scheme_prefix), $.embedded_scheme_text),
    // Taken from tree-sitter-lilypond/lilypond/rules.js
    embedded_scheme: ($) =>
      seq(alias(/[#$]@?/, $.embedded_scheme_prefix), $.embedded_scheme_text),
    // Taken from tree-sitter-lilypond/lilypond/rules.js
    embedded_scheme_text: ($) =>
      choice(
        $._scheme_simple_datum,
        seq(repeat($.scheme_comment), $._scheme_compound_datum),
      ),
    // Override to embed our own lilypond grammar
    // Adapted from tree-sitter-lilypond/lilypond-scheme/rules.js
    scheme_embedded_lilypond_text: ($) =>
      choice(
        repeat1($.comment),

        seq(repeat($.comment), repeat1($._music_list)),
      ),
    //  }}}
  },
});

// vim: fdm=marker

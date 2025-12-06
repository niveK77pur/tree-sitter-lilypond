/**
 * @file LilyPond grammar for tree-sitter
 * @author niveK77pur <kevinbiewesch@yahoo.fr>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "lilypond",

  extras: ($) => [/\s/, $.version_statement],

  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) => $.music,

    version_statement: ($) => seq("\\version", $.text),

    /** A music block */
    music: ($) => seq("{", repeat($._music_list), "}"),

    /** Items within a music block */
    _music_list: ($) =>
      choice($.note, $.rest, $.time_signature_event, $.tempo_event, $.clef),

    note: ($) =>
      seq(
        field("name", $.note_name),
        optional(field("octave", $.note_octave)),
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

    note_octave: (_) => choice(repeat1("'"), repeat1(",")),

    steno_duration: (_) => /[0-9]+\.*/,

    number: (_) => /[0-9]+/,
    text: (_) => /".*"/,

    time_signature_event: ($) =>
      // TODO: Scheme fractional time signature: https://lilypond.org/doc/v2.25/Documentation/notation/displaying-rhythms.html
      seq(
        "\\time",
        field("numerator", $.number),
        "/",
        field("denominator", $.number),
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
  },
});

// vim: fdm=marker

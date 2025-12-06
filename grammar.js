/**
 * @file LilyPond grammar for tree-sitter
 * @author niveK77pur <kevinbiewesch@yahoo.fr>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "lilypond",

  rules: {
    // TODO: add the actual grammar rules
    source_file: ($) => $.music,

    /** A music block */
    music: ($) => seq("{", repeat($._music_list), "}"),

    /** Items within a music block */
    _music_list: ($) => choice($.note, $.rest),

    note: ($) =>
      seq(
        field("name", $.note_name),
        optional(field("octave", $.note_octave)),
        optional(field("duration", $.note_duration)),
      ),

    rest: ($) => seq("r", optional(field("duration", $.note_duration))),

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

    note_duration: (_) => /[0-9]+\.*/,
  },
});

// vim: fdm=marker

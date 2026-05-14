import { Font } from "./controls/Font";

export class Fonts {
  // NumericInput digits need to be monospaced (5 pixels here).
  static font10 = new Font("?", 5, [
    "0     1     2     3     4     5     6     7     8     9     A     B     C     D     E     F     G     H     I   J     K     L     M     N     O     P     Q     R     S     T     U     V     W     X     Y     Z     a     b     c     d     e     f     g     h     i   j    k     l   m     n    o     p     q     r     s     t     u     v     w     x     y     z     ,  ?     ;  . : /     ! *     &     ' (   -     )   =     +      ~      #     ²     ",
    "                                                                                                                                                                                                                                                                                                                                                                                                                                                          ² *** ",
    "  ***    *    ***  *****    *  *****   **  *****  ***   ***    *   ****   ***  ***   ***** *****  **** *   * ***     * *   * *     *   * *   *  ***  ****   ***  ****   ***  ***** *   * *   * *   * *   * *   * *****       *               *         **        *      *     * *     **                                            *                                                              *   *    *    *   *       *                        * * ²*   *",
    " *   *  **   *   *     *   **  *      *        * *   * *   *  * *  *   * *   * *  *  *     *     *     *   *  *      * *  *  *     ** ** *   * *   * *   * *   * *   * *   *   *   *   * *   * *   * *   * *   *     *       *               *        *  *       *              *      *                                            *                                            ***             * * * * * * *   *  *         *          *     **  *  * * ²   * ",
    " *  **   *       *    *   * *  ****  *        *  *   * *   * *   * *   * *     *   * *     *     *     *   *  *      * * *   *     * * * **  * *   * *   * *   * *   * *       *   *   * *   * *   *  * *   * *     *   ***  ****   ****  ****  ***   *     ***  ****  **    ** *   *  *  ** ** ***   ***  ****   **** * ***  **** ****  *   * *   * *   * *   * *   * *****    *   *  *   *    *  *  ***  * *     *           * *****   *    *  **  *****²  *  ",
    " * * *   *      *    **  *  *      * ****    *    ***   **** *   * ****  *     *   * ****  ****  *     *****  *      * **    *     * * * * * * *   * ****  *   * ****   ***    *   *   * *   * * * *   *     *     *       * *   * *     *   * *   * ****  *   * *   *  *     * *  *   *  * * * *  * *   * *   * *   * **    *      *    *   * *   * * * *  * *  *   *    *        *           *   *   *    *      *   *****   *       *****          * * ² *   ",
    " **  *   *     *       * *****     * *   *  *    *   *     * ***** *   * *     *   * *     *     *  ** *   *  *      * * *   *     *   * *  ** *   * *     * * * * *       *   *   *   * *   * * * *  * *    *    *     **** *   * *     *   * *****  *    *   * *   *  *     * ***    *  * * * *  * *   * *   * *   * *      ***   *    *   * *   * * * *   *   *   *   *        *           *    *  ***  * * *   *           * *****   *     **  * *****²*****",
    " *   *   *    *    *   *    *  *   * *   *  *    *   *    *  *   * *   * *   * *  *  *     *     *   * *   *  *  *   * *  *  *     *   * *   * *   * *     *  *  *  *  *   *   *   *   *  * *  ** ** *   *   *   *     *   * *   * *     *   * *      *    *   * *   *  *     * *  *   *  * * * *  * *   * *   * *   * *         *  *  * *  **  * *  * * *  * *  *   *  *     *        *   * *       * * * *  *     *         *          *    *  **   * * ²     ",
    "  ***   ***  *****  ***     *   ***   ***   *     ***   **   *   * ****   ***  ***   ***** *      **** *   * ***  ***  *   * ***** *   * *   *  ***  *      ** * *   *  ***    *    ***    *   *   * *   *   *   *****  **** ****   ****  ****  ****  *     **** *   * ***    * *   * *** * * * *  *  ***  ****   **** *     ****    **   ** *   *   ** ** *   *  **** *****  *   *    * *         *   *    ** *     *       *                        * * ²     ",
    "                                                                                                                                                                                                                                                               *              *                            *         *                                               *       *        *                                                                   ²     ",
    "                                                                                                                                                                                                                                                            ***            ***                             *         *                                            ***                                                                                     ²     ",
  ]).append([
    "<   >   | @     □         ○         △         ✕         ·         ↑     ↓     ←    →    ☰     ☐     ☑     ◉     🥉     🥈     🥇     ▿     ",
    "                 GGGGGGGGG RRRRRRRRR YYYYYYYYY BBBBBBBBB wwwwwwwww                      ☰                 ◉     🥉bbbbb🥈bbbbb🥇bbbbb▿     ",
    "                 GgggggggG RrrrrrrrR YyyyyyyyY BbbbbbbbB wwwwwwwww                      ☰                 ◉     🥉 bbb 🥈 bbb 🥇 bbb ▿     ",
    "         *  ***  GgGGGGGgG RrrRRRrrR YyyyYyyyY BbBbbbBbB wwwwwwwww               *   *  ☰***** ***** *****◉ yyy 🥉 ooo 🥈 www 🥇 yyy ▿     ",
    "   * *   * *   * GgGgggGgG RrRrrrRrR YyyYyYyyY BbbBbBbbB wwwwwwwww   *   *****  **   ** ☰      *   * **** ◉yYYYy🥉oOOOo🥈wWWWw🥇yYYYy▿*****",
    "  *   *  * * *** GgGgggGgG RrRrrrRrR YyyYyYyyY BbbbBbbbB wwww*wwww  ***   ***  ***   ***☰***** *   * * * *◉yYYYy🥉oOOOo🥈wWWWw🥇yYYYy▿*   *",
    " *     * * * * * GgGgggGgG RrRrrrRrR YyYyyyYyY BbbBbBbbB wwwwwwwww *****   *    **   ** ☰      *   * ** **◉yYYYy🥉oOOOo🥈wWWWw🥇yYYYy▿ * * ",
    "  *   *  *   *** GgGGGGGgG RrrRRRrrR YyYYYYYyY BbBbbbBbB wwwwwwwww               *   *  ☰***** ***** *****◉ yyy 🥉 ooo 🥈 www 🥇 yyy ▿  *  ",
    "   * *           GgggggggG RrrrrrrrR YyyyyyyyY BbbbbbbbB wwwwwwwww                      ☰                 ◉     🥉     🥈     🥇     ▿     ",
    "                 GGGGGGGGG RRRRRRRRR YYYYYYYYY BBBBBBBBB wwwwwwwww                      ☰                 ◉     🥉     🥈     🥇     ▿     ",
    "                                                                                                                       ",
  ]);

  static font10bold = new Font("?", 6, [
    "0      1     2      3      4      5      6      7      8      9      A      B      C      D      E      F      G      H      I    J      K      L      M       N      O      P      Q      R      S      T      U      V      W       X      Y      Z      a      b      c      d      e      f      g      h      i    j     k      l    m       n     o      p      q      r      s      t      u      v      w       x      y      z      ,   ?      ;   .  :  /      !  *        &      '  (    -      )    =      +              <    >    ",
    "                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ",
    "  ****    **   ****  ******    **  ******   ***  ******  ****   ****    **   *****   ****  ****   ****** ******  ***** **  ** ****     ** **  ** **     **   ** **  **  ****  *****   ****  *****   ****  ****** **  ** **  ** **   ** **  ** **  ** ******        **                **          ***         **      **     ** **     ***                                                    **                                                                           **    **     **    **   **        **                                  ",
    " **  **  ***  **  **     **   ***  **      **        ** **  ** **  **  ****  **  ** **  ** ** **  **     **     **     **  **  **      ** ** **  **     *** *** **  ** **  ** **  ** **  ** **  ** **  **   **   **  ** **  ** **   ** **  ** **  **     **        **                **         ** **        **                **      **                                                    **                                                    ****                ** ** ** ** ** ****   **  **          **           **                    ",
    " ** ***   **      **    **   ****  *****  **        **  **  ** **  ** **  ** **  ** **     **  ** **     **     **     **  **  **      ** ****   **     ******* *** ** **  ** **  ** **  ** **  ** **       **   **  ** **  ** **   **  ****   ****     **   ****  *****   *****  *****  ****   **     ****  *****  ***    *** **  **  **  ******  ****   ****  *****   ***** ******  ***** *****  **  ** **  ** **   ** **  ** **  ** ******     **  **  **    **    **  **  ******  ****      **            ** ******   **             ** **  ",
    " ******   **     **    ***  ** **      ** *****    **    ****   ***** **  ** *****  **     **  ** *****  *****  **     ******  **      ** ***    **     ** * ** ****** **  ** *****  **  ** *****   ****    **   **  ** **  ** ** * **   **     **     **       ** **  ** **     **  ** **  ** *****  **  ** **  **  **     ** ** **   **  ** * ** ** ** **  ** **  ** **  ** ***    **      **    **  ** **  ** ** * **  ****  **  **    **         **              **   **    **     **       **   ******   **        ******          **   ** ",
    " *** **   **    **       ** ******     ** **  **  **    **  **     ** ****** **  ** **     **  ** **     **     ** *** **  **  **      ** ****   **     **   ** ** *** **  ** **     ****** ****       **   **   **  ** **  ** *******  ****    **    **     ***** **  ** **     **  ** ******  **    **  ** **  **  **     ** ****    **  ** * ** ** ** **  ** **  ** **  ** **      ****   **    **  ** **  ** ** * **   **   **  **   **         **              **    **  ******  ******    **            ** ******   **           **     **",
    " **  **   **   **    **  **    **  **  ** **  **  **    **  **    **  **  ** **  ** **  ** ** **  **     **     **  ** **  **  **  **  ** ** **  **     **   ** **  ** **  ** **     ** **  ** **  **  **   **   **  **  ****  *** *** **  **   **   **     **  ** **  ** **     **  ** **      **    **  ** **  **  **     ** ** **   **  ** * ** ** ** **  ** **  ** **  ** **         **  ** ** ** ***  ****  ** * **  ****  **  **  **     **         ** ** ** **        ** ** ** ** **      **          **           **            **   ** ",
    "  ****   **** ******  ****     **   ****   ****   **     ****   ***   **  ** *****   ****  ****   ****** **      ***** **  ** ****  ****  **  ** ****** **   ** **  **  ****  **      ***** **  **  ****    **    ****    **   **   ** **  **   **   ******  ***** *****   *****  *****  *****  **     ***** **  ** ****    ** **  ** **** ** * ** ** **  ****  *****   ***** **     *****    ***   *****   **   ******* **  **  ***** ******  **   **    ** **           **    **     *****      **        **                           ** **  ",
    "                                                                                                                                                                                                                                                                                                          **                **                                  **         **                                                       **        **         **                                                                                     ",
    "                                                                                                                                                                                                                                                                                                      ****              ****                                   **         **                                                    ****                                                                                                           "
  ], { fallbackFont: this.font10 });

  static defaultFont = Fonts.font10; // Fonts.font5x10;

  static font10_slego = new Font("·", 10, [
    "S          L          E          G          □          ○          △          ✕          ·          ",
    "    RRRR    GG         BBBBBBBBBB    YYYY    GGGGGGGGGG    RRRR        **     **      **            ",
    "  RRRRRRRR  GG         BBBBBBBBBB  YYYYYYYY  GGGGGGGGGG  RRRRRRRR     ****    ***    ***            ",
    " RRR    RRR GG         BB         YYY    YYY GG      GG RRR    RRR    ****     ***  ***             ",
    " RRRR    RR GG         BB         YY      YY GG      GG RR      RR   **  **     ******              ",
    "  RRRRRR    GG         BBBBBB     YY         GG      GG RR      RR   **  **      ****        **     ",
    "     RRRRR  GG         BBBBBB     YY   YYYYY GG      GG RR      RR  **    **     ****        **     ",
    " RR    RRRR GG         BB         YY   YYYYY GG      GG RR      RR  **    **    ******              ",
    " RRR     RR GG         BB         YYY    YYY GG      GG RRR    RRR **      **  ***  ***             ",
    "  RRRRRRRR  GGGGGGGGGG BBBBBBBBBB  YYYYYYYY  GGGGGGGGGG  RRRRRRRR  ********** ***    ***            ",
    "   RRRRRR   GGGGGGGGGG BBBBBBBBBB   YYYYYY   GGGGGGGGGG   RRRRRR   ********** **      **            "
  ]).append([
    "←     →      ☰       ",
    "                     ",
    "    *   *     *******",
    "   **   **    *******",
    "  ***   ***          ",
    " ****   ****  *******",
    " ****   ****  *******",
    "  ***   ***          ",
    "   **   **    *******",
    "    *   *     *******",
    "                     "
  ]);

  static font15_slego = new Font("·", 15, [
    //123456789012345 123456789012345 123456789012345 123456789012345 123456789012345 123456789012345 123456789012345 123456789012345 123456789012345 123456789012345 123456789012345 123456789012345 
    "□               ○               △               ✕               ·               E               S               L               G               🔊              🔇              ",
    " GGGGGGGGGGGGGGG     RRRRRRR           ***       ***         ***                 BBBBBBBBBBBBBBB     RRRRRRR     GGG                 YYYYYYY                                    ",
    " GGGGGGGGGGGGGGG   RRRRRRRRRRR         ***       ****       ****                 BBBBBBBBBBBBBBB     RRRRRRR     GGG                 YYYYYYY           **              **       ",
    " GGGGGGGGGGGGGGG  RRRRRRRRRRRRR       *****      *****     *****                 BBBBBBBBBBBBBBB  RRRRRRRRRRRRR  GGG              YYYYYYYYYYYYY       *** ***         ***       ",
    " GGG         GGG  RRRR     RRRR       ** **       *****   *****                  BBB             RRRR       RRRR GGG             YYYY       YYYY     ****    *       ****       ",
    " GGG         GGG RRRR       RRRR     *** ***       ***** *****                   BBB             RRRR       RRRR GGG             YYYY       YYYY    ***** **  *     *****       ",
    " GGG         GGG RRR         RRR     **   **        *********                    BBB             RRRRRR      RRR GGG             YYY         YYY  *******   * *   ******* *   * ",
    " GGG         GGG RRR         RRR    ***   ***        *******           ***       BBBBBBBBB        RRRRRRRRRR     GGG             YYY              *******   * *   *******  * *  ",
    " GGG         GGG RRR         RRR    **     **         *****            ***       BBBBBBBBB             RRRRRRRR  GGG             YYY    YYYYYYYY  *******   * *   *******   *   ",
    " GGG         GGG RRR         RRR   ***     ***       *******           ***       BBBBBBBBB             RRRRRRRR  GGG             YYY    YYYYYYYY  *******   * *   *******  * *  ",
    " GGG         GGG RRR         RRR   **       **      *********                    BBB             RRR      RRRRRR GGG             YYY    YYYYYYYY  *******   * *   ******* *   * ",
    " GGG         GGG RRRR       RRRR  ***       ***    ***** *****                   BBB             RRRR        RRR GGG             YYYY       YYYY    ***** **  *     *****       ",
    " GGG         GGG  RRRR     RRRR   **         **   *****   *****                  BBB             RRRR        RRR GGG             YYYY       YYYY     ****    *       ****       ",
    " GGGGGGGGGGGGGGG  RRRRRRRRRRRRR  *************** *****     *****                 BBBBBBBBBBBBBBB  RRRRRRRRRRRRR  GGGGGGGGGGGGGGG  YYYYYYYYYYYYY       *** ***         ***       ",
    " GGGGGGGGGGGGGGG   RRRRRRRRRRR   *************** ****       ****                 BBBBBBBBBBBBBBB    RRRRRRRRR    GGGGGGGGGGGGGGG    YYYYYYYYY          **              **       ",
    " GGGGGGGGGGGGGGG     RRRRRRR     *************** ***         ***                 BBBBBBBBBBBBBBB    RRRRRRRRR    GGGGGGGGGGGGGGG    YYYYYYYYY                                                       "
  ]);
}


// function createBoldFont(baseFont: Font) {
//   let lines: string[] = [];
//   let height = baseFont.height;
//   for (let ch of Object.keys(baseFont.chars)) {
//     let char = baseFont.chars[ch] as FontCharacter;
//     let width = char.width + 1;
//     lines[0] = (lines[0] || "") + ch.padEnd(width + 1, " ")
//     for (let i = 1; i <= height; i++) {
//       let bits = char.bits[i - 1];
//       let newBits = "";
//       if (bits) {
//         for (let j = 0; j <= bits.length; j++) {
//           let newChar = bits[j];
//           if (!newChar || (newChar == " " && j > 0)) newChar = bits[j - 1];
//           newBits += newChar;
//         }
//       }
//       lines[i] = (lines[i] || "") + newBits.padStart(width + 1, " ");
//     }
//   }
//   console.log(lines);
//   let newFont = new Font(baseFont.defaultCharacter, baseFont.spaceWidth + 1, lines);
//   return newFont;
// }

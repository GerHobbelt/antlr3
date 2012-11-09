/*
 [The "BSD license"]
 Copyright (c) 2005-2009 Terence Parr
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 1. Redistributions of source code must retain the above copyright
     notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright
     notice, this list of conditions and the following disclaimer in the
     documentation and/or other materials provided with the distribution.
 3. The name of the author may not be used to endorse or promote products
     derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/** A parser for TokenStreams.  "parser grammars" result in a subclass
 *  of this.
 */
org.antlr.runtime.Parser = function(input, state) {
    org.antlr.runtime.Parser.superclass.constructor.call(this, state);
    this.setTokenStream(input);
};

org.antlr.lang.extend(org.antlr.runtime.Parser, org.antlr.runtime.BaseRecognizer, {
    reset: function() {
        // reset all recognizer state variables
        org.antlr.runtime.Parser.superclass.reset.call(this);
        if ( org.antlr.lang.isValue(this.input) ) {
            this.input.seek(0); // rewind the input
        }
    },

    getCurrentInputSymbol: function(input) {
        return input.LT(1);
    },

    getMissingSymbol: function(input,
                               e,
                               expectedTokenType,
                               follow)
    {
        var tokenText =
            "<missing "+this.getTokenNames()[expectedTokenType]+">";
        var t = new org.antlr.runtime.CommonToken(expectedTokenType, tokenText);
        var current = input.LT(1);
        var old_current;
        if ( current.getType() === org.antlr.runtime.Token.EOF ) {
            old_current = current;
            current = input.LT(-1);
            // handle edge case where there are no good tokens in the stream
            if (!current) {
                current = old_current;
            }
        }
        t.line = current.getLine();
        t.charPositionInLine = current.getCharPositionInLine();
        t.channel = org.antlr.runtime.BaseRecognizer.DEFAULT_TOKEN_CHANNEL;
        return t;
    },


    /** Set the token stream and reset the parser */
    setTokenStream: function(input) {
        this.input = null;
        this.reset();
        this.input = input;
    },

    getTokenStream: function() {
        return this.input;
    },

    getSourceName: function() {
        return this.input.getSourceName();
    },

    traceIn: function(ruleName, ruleIndex)  {
        org.antlr.runtime.Parser.superclass.traceIn.call(
                this, ruleName, ruleIndex, this.input.LT(1));
    },

    traceOut: function(ruleName, ruleIndex)  {
        org.antlr.runtime.Parser.superclass.traceOut.call(
                this, ruleName, ruleIndex, this.input.LT(1));
    }
});

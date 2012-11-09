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

org.antlr.runtime.CommonToken = function() {
    var oldToken;

    this.charPositionInLine = -1; // set to invalid position
    this.channel = 0; // org.antlr.runtime.CommonToken.DEFAULT_CHANNEL
    this.index = -1;

    if (arguments.length == 1) {
        if (org.antlr.lang.isNumber(arguments[0])) {
            this.type = arguments[0];
        } else {
            oldToken = arguments[0];
            this.text = oldToken.getText();
            this.type = oldToken.getType();
            this.line = oldToken.getLine();
            this.index = oldToken.getTokenIndex();
            this.charPositionInLine = oldToken.getCharPositionInLine();
            this.channel = oldToken.getChannel();
            if ( oldToken instanceof org.antlr.runtime.CommonToken ) {
                this.start = oldToken.start;
                this.stop = oldToken.stop;
            }
        }
    } else if (arguments.length == 2) {
        this.type = arguments[0];
        this.text = arguments[1];
        this.channel = 0; // org.antlr.runtime.CommonToken.DEFAULT_CHANNEL
    } else if (arguments.length == 5) {
        this.input = arguments[0];
        this.type = arguments[1];
        this.channel = arguments[2];
        this.start = arguments[3];
        this.stop = arguments[4];
    }
};

org.antlr.lang.extend(org.antlr.runtime.CommonToken,
                      org.antlr.runtime.Token,
{
    getType: function() {
        return this.type;
    },

    setLine: function(line) {
        this.line = line;
    },

    getText: function() {
        if ( org.antlr.lang.isString(this.text) ) {
            return this.text;
        }
        if ( !this.input ) {
            return null;
        }
        this.text = this.input.substring(this.start,this.stop);
        return this.text;
    },

    /** Override the text for this token.  getText() will return this text
     *  rather than pulling from the buffer.  Note that this does not mean
     *  that start/stop indexes are not valid.  It means that that input
     *  was converted to a new string in the token object.
     */
    setText: function(text) {
        this.text = text;
    },

    getLine: function() {
        return this.line;
    },

    getCharPositionInLine: function() {
        return this.charPositionInLine;
    },

    setCharPositionInLine: function(charPositionInLine) {
        this.charPositionInLine = charPositionInLine;
    },

    getChannel: function() {
        return this.channel;
    },

    setChannel: function(channel) {
        this.channel = channel;
    },

    setType: function(type) {
        this.type = type;
    },

    getStartIndex: function() {
        return this.start;
    },

    setStartIndex: function(start) {
        this.start = start;
    },

    getStopIndex: function() {
        return this.stop;
    },

    setStopIndex: function(stop) {
        this.stop = stop;
    },

    getTokenIndex: function() {
        return this.index;
    },

    setTokenIndex: function(index) {
        this.index = index;
    },

    getInputStream: function() {
        return this.input;
    },

    setInputStream: function(input) {
        this.input = input;
    },

    toString: function() {
        var channelStr = "";
        if ( this.channel>0 ) {
            channelStr=",channel="+this.channel;
        }
        var txt = this.getText();
        if ( !org.antlr.lang.isNull(txt) ) {
            txt = txt.replace(/\n/g,"\\\\n");
            txt = txt.replace(/\r/g,"\\\\r");
            txt = txt.replace(/\t/g,"\\\\t");
        }
        else {
            txt = "<no text>";
        }
        return "[@"+this.getTokenIndex()+","+this.start+":"+this.stop+"='"+txt+"',<"+this.type+">"+channelStr+","+this.line+":"+this.getCharPositionInLine()+"]";
    }
});

/* Monkey patch Token static vars that depend on CommonToken. */
org.antlr.lang.augmentObject(org.antlr.runtime.Token, {
    EOF_TOKEN: new org.antlr.runtime.CommonToken(org.antlr.runtime.CharStream.EOF),
    INVALID_TOKEN: new org.antlr.runtime.CommonToken(0),
    SKIP_TOKEN: new org.antlr.runtime.CommonToken(0)
}, true);

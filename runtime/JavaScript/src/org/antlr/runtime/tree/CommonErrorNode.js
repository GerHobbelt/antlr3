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

org.antlr.runtime.tree.CommonErrorNode = function(input, start, stop, e) {
    if ( !stop ||
            (stop.getTokenIndex() < start.getTokenIndex() &&
             stop.getType()!=org.antlr.runtime.Token.EOF) )
    {
        // sometimes resync does not consume a token (when LT(1) is
        // in follow set.  So, stop will be 1 to left to start. adjust.
        // Also handle case where start is the first token and no token
        // is consumed during recovery; LT(-1) will return null.
        stop = start;
    }
    this.input = input;
    this.start = start;
    this.stop = stop;
    this.trappedException = e;
};

org.antlr.lang.extend(org.antlr.runtime.tree.CommonErrorNode, org.antlr.runtime.tree.CommonTree, {
    isNil: function() {
        return false;
    },

    getType: function() {
        return org.antlr.runtime.Token.INVALID_TOKEN_TYPE;
    },

    getText: function() {
        var badText = null;
        if ( this.start instanceof org.antlr.runtime.Token ) {
            var i = this.start.getTokenIndex();
            var j = this.stop.getTokenIndex();
            if ( this.stop.getType() === org.antlr.runtime.Token.EOF ) {
                j = this.input.size();
            }
            badText = this.input.toString(i, j);
        }
        else if ( this.start instanceof org.antlr.runtime.tree.Tree ) {
            badText = this.input.toString(this.start, this.stop);
        }
        else {
            // people should subclass if they alter the tree type so this
            // next one is for sure correct.
            badText = "<unknown>";
        }
        return badText;
    },

    toString: function() {
        if ( this.trappedException instanceof org.antlr.runtime.MissingTokenException ) {
            return "<missing type: "+
                   this.trappedException.getMissingType()+
                   ">";
        }
        else if ( this.trappedException instanceof org.antlr.runtime.UnwantedTokenException ) {
            return "<extraneous: "+
                   this.trappedException.getUnexpectedToken()+
                   ", resync="+this.getText()+">";
        }
        else if ( this.trappedException instanceof org.antlr.runtime.MismatchedTokenException ) {
            return "<mismatched token: "+this.trappedException.token+", resync="+this.getText()+">";
        }
        else if ( this.trappedException instanceof org.antlr.runtime.NoViableAltException ) {
            return "<unexpected: "+this.trappedException.token+
                   ", resync="+this.getText()+">";
        }
        return "<error: "+this.getText()+">";
    }
});

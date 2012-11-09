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

/** Queues up nodes matched on left side of -> in a tree parser. This is
 *  the analog of RewriteRuleTokenStream for normal parsers.
 */
org.antlr.runtime.tree.RewriteRuleNodeStream = function(adaptor, elementDescription, el) {
    org.antlr.runtime.tree.RewriteRuleNodeStream.superclass.constructor.apply(this, arguments);
};

org.antlr.lang.extend(org.antlr.runtime.tree.RewriteRuleNodeStream,
                  org.antlr.runtime.tree.RewriteRuleElementStream,
{
    nextNode: function() {
        return this._next();
    },

    toTree: function(el) {
        return this.adaptor.dupNode(el);
    },

    dup: function() {
        // we dup every node, so don't have to worry about calling dup; short-
        // circuited next() so it doesn't call.
        throw new Error("dup can't be called for a node stream.");
    }
});

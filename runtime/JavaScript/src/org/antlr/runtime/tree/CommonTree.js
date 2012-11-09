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

/** A tree node that is wrapper for a Token object.  After 3.0 release
 *  while building tree rewrite stuff, it became clear that computing
 *  parent and child index is very difficult and cumbersome.  Better to
 *  spend the space in every tree node.  If you don't want these extra
 *  fields, it's easy to cut them out in your own BaseTree subclass.
 */
org.antlr.runtime.tree.CommonTree = function(node) {
    /** A single token is the payload */
    this.token = null;

    /** What token indexes bracket all tokens associated with this node
     *  and below?
     */
    this.startIndex = -1;
    this.stopIndex = -1;

    /** Who is the parent node of this node; if null, implies node is root */
    this.parent = null;

    /** What index is this node in the child list? Range: 0..n-1 */
    this.childIndex = -1;

    if (node instanceof org.antlr.runtime.tree.CommonTree) {
        org.antlr.runtime.tree.CommonTree.superclass.constructor.call(this, node);
        this.token = node.token;
        this.startIndex = node.startIndex;
        this.stopIndex = node.stopIndex;
    } else if (node instanceof org.antlr.runtime.CommonToken) {
        this.token = node;
    }
};

/** A tree node that is wrapper for a Token object. */
org.antlr.lang.extend(org.antlr.runtime.tree.CommonTree, org.antlr.runtime.tree.BaseTree, {
    getToken: function() {
        return this.token;
    },

    dupNode: function() {
        return new org.antlr.runtime.tree.CommonTree(this);
    },

    isNil: function() {
        return !this.token;
    },

    getType: function() {
        if ( !this.token ) {
            return org.antlr.runtime.Token.INVALID_TOKEN_TYPE;
        }
        return this.token.getType();
    },

    getText: function() {
        if ( !this.token ) {
            return null;
        }
        return this.token.getText();
    },

    getLine: function() {
        if ( !this.token || this.token.getLine()===0 ) {
            if ( this.getChildCount()>0 ) {
                return this.getChild(0).getLine();
            }
            return 0;
        }
        return this.token.getLine();
    },

    getCharPositionInLine: function() {
        if ( !this.token || this.token.getCharPositionInLine()===-1 ) {
            if ( this.getChildCount()>0 ) {
                return this.getChild(0).getCharPositionInLine();
            }
            return 0;
        }
        return this.token.getCharPositionInLine();
    },

    getTokenStartIndex: function() {
        if ( this.token ) {
            return this.token.getTokenIndex();
        }
        return this.startIndex;
    },

    setTokenStartIndex: function(index) {
        this.startIndex = index;
    },

    getTokenStopIndex: function() {
        if ( this.token ) {
            return this.token.getTokenIndex();
        }
        return this.stopIndex;
    },

    setTokenStopIndex: function(index) {
        this.stopIndex = index;
    },

    getChildIndex: function() {
        return this.childIndex;
    },

    getParent: function() {
        return this.parent;
    },

    setParent: function(t) {
        this.parent = t;
    },

    setChildIndex: function(index) {
        this.childIndex = index;
    },

    toString: function() {
        if ( this.isNil() ) {
            return "nil";
        }
        if ( this.getType()===org.antlr.runtime.Token.INVALID_TOKEN_TYPE ) {
            return "<errornode>";
        }
        if ( !this.token ) {
            return null;
        }
        return this.token.getText();
    }
});

/* Monkey patch Tree static property with CommonToken value. */
org.antlr.runtime.tree.Tree.INVALID_NODE =
  new org.antlr.runtime.tree.CommonTree(org.antlr.runtime.Token.INVALID_TOKEN);

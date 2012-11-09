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

/** A TreeAdaptor that works with any Tree implementation.  It provides
 *  really just factory methods; all the work is done by BaseTreeAdaptor.
 *  If you would like to have different tokens created than ClassicToken
 *  objects, you need to override this and then set the parser tree adaptor to
 *  use your subclass.
 *
 *  To get your parser to build nodes of a different type, override
 *  create(Token).
 */
org.antlr.runtime.tree.CommonTreeAdaptor = function() {};

org.antlr.lang.extend(org.antlr.runtime.tree.CommonTreeAdaptor,
                  org.antlr.runtime.tree.BaseTreeAdaptor, {
    /** Duplicate a node.  This is part of the factory;
     *    override if you want another kind of node to be built.
     *
     *  I could use reflection to prevent having to override this
     *  but reflection is slow.
     */
    dupNode: function(t) {
        if ( !org.antlr.lang.isValue(t) ) {
            return null;
        }
        return t.dupNode();
    },

    create: function(payload) {
        if (arguments.length>1) {
            return org.antlr.runtime.tree.CommonTreeAdaptor.superclass.create.apply(this, arguments);
        }
        return new org.antlr.runtime.tree.CommonTree(payload);
    },

    /** Tell me how to create a token for use with imaginary token nodes.
     *  For example, there is probably no input symbol associated with imaginary
     *  token DECL, but you need to create it as a payload or whatever for
     *  the DECL node as in ^(DECL type ID).
     *
     *  If you care what the token payload objects' type is, you should
     *  override this method and any other createToken variant.
     *
     * Tell me how to create a token for use with imaginary token nodes.
     *  For example, there is probably no input symbol associated with imaginary
     *  token DECL, but you need to create it as a payload or whatever for
     *  the DECL node as in ^(DECL type ID).
     *
     *  This is a variant of createToken where the new token is derived from
     *  an actual real input token.  Typically this is for converting '{'
     *  tokens to BLOCK etc...  You'll see
     *
     *    r : lc='{' ID+ '}' -> ^(BLOCK[$lc] ID+) ;
     *
     *  If you care what the token payload objects' type is, you should
     *  override this method and any other createToken variant.
     */
    createToken: function(fromToken) {
        if (arguments.length===2) {
            return new org.antlr.runtime.CommonToken(arguments[0], arguments[1]);
        } else {
            return new org.antlr.runtime.CommonToken(arguments[0]);
        }
    },

    /** Track start/stop token for subtree root created for a rule.
     *  Only works with Tree nodes.  For rules that match nothing,
     *  seems like this will yield start=i and stop=i-1 in a nil node.
     *  Might be useful info so I'll not force to be i..i.
     */
    setTokenBoundaries: function(t, startToken, stopToken) {
        if ( !org.antlr.lang.isValue(t) ) {
            return;
        }
        var start = 0,
            stop = 0;
        if ( org.antlr.lang.isValue(startToken) ) {
            if (startToken.getTokenIndex) {
                start = startToken.getTokenIndex();
            } else if (startToken.getStartIndex) {
                start = startToken.getStartIndex();
            } else {
                start = startToken.getTokenStartIndex();
            }
        }
        if ( org.antlr.lang.isValue(stopToken) ) {
            if (stop.getTokenIndex) {
                stop = stopToken.getTokenIndex();
            } else if (stopToken.getStopIndex) {
                stop = stopToken.getStopIndex();
            } else {
                stop = stopToken.getTokenStopIndex();
            }
        }
        t.setTokenStartIndex(start);
        t.setTokenStopIndex(stop);
    },

    getTokenStartIndex: function(t) {
        if (!t) {
            return -1;
        }
        return t.getTokenStartIndex();
    },

    getTokenStopIndex: function(t) {
        if (!t) {
            return -1;
        }
        return t.getTokenStopIndex();
    },

    getText: function(t) {
        if (!t) {
            return null;
        }
        return t.getText();
    },

    getType: function(t) {
        if (!t) {
            return org.antlr.runtime.Token.INVALID_TOKEN_TYPE;
        }
        return t.getType();
    },

    /** What is the Token associated with this node?  If
     *  you are not using CommonTree, then you must
     *  override this in your own adaptor.
     */
    getToken: function(t) {
        if ( t instanceof org.antlr.runtime.tree.CommonTree ) {
            return t.getToken();
        }
        return null; // no idea what to do
    },

    getChild: function(t, i) {
        if (!t) {
            return null;
        }
        return t.getChild(i);
    },

    getChildCount: function(t) {
        if (!t) {
            return 0;
        }
        return t.getChildCount();
    },

    getParent: function(t) {
        return t.getParent();
    },

    setParent: function(t, parent) {
        t.setParent(parent);
    },

    getChildIndex: function(t) {
        return t.getChildIndex();
    },

    setChildIndex: function(t, index) {
        t.setChildIndex(index);
    },

    replaceChildren: function(parent, startChildIndex, stopChildIndex, t) {
        if ( parent ) {
            parent.replaceChildren(startChildIndex, stopChildIndex, t);
        }
    }
});

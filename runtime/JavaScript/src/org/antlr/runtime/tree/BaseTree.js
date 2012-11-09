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

/** A generic tree implementation with no payload.  You must subclass to
 *  actually have any user data.  ANTLR v3 uses a list of children approach
 *  instead of the child-sibling approach in v2.  A flat tree (a list) is
 *  an empty node whose children represent the list.  An empty, but
 *  non-null node is called "nil".
 */
org.antlr.runtime.tree.BaseTree = function() {};

org.antlr.lang.extend(org.antlr.runtime.tree.BaseTree,
                      org.antlr.runtime.tree.Tree,
{
    getChild: function(i) {
        if ( !this.children || i>=this.children.length ) {
            return null;
        }
        return this.children[i];
    },

    /** Get the children internal List; note that if you directly mess with
     *  the list, do so at your own risk.
     */
    getChildren: function() {
        return this.children;
    },

    getFirstChildWithType: function(type) {
        var i, t;
        for (i = 0; this.children && i < this.children.length; i++) {
            t = this.children[i];
            if ( t.getType()===type ) {
                return t;
            }
        }
        return null;
    },

    getChildCount: function() {
        if ( !this.children ) {
            return 0;
        }
        return this.children.length;
    },

    /** Add t as child of this node.
     *
     *  Warning: if t has no children, but child does
     *  and child isNil then this routine moves children to t via
     *  t.children = child.children; i.e., without copying the array.
     */
    addChild: function(t) {
        if ( !org.antlr.lang.isValue(t) ) {
            return; // do nothing upon addChild(null)
        }
        var childTree = t, n, i, c;
        if ( childTree.isNil() ) { // t is an empty node possibly with children
            if ( this.children && this.children == childTree.children ) {
                throw new Error("attempt to add child list to itself");
            }
            // just add all of childTree's children to this
            if ( childTree.children ) {
                if ( this.children ) { // must copy, this has children already
                    n = childTree.children.length;
                    for (i = 0; i < n; i++) {
                        c = childTree.children[i];
                        this.children.push(c);
                        // handle double-link stuff for each child of nil root
                        c.setParent(this);
                        c.setChildIndex(this.children.length-1);
                    }
                }
                else {
                    // no children for this but t has children; just set pointer
                    // call general freshener routine
                    this.children = childTree.children;
                    this.freshenParentAndChildIndexes();
                }
            }
        }
        else { // child is not nil (don't care about children)
            if ( !this.children ) {
                this.children = this.createChildrenList(); // create children list on demand
            }
            this.children.push(t);
            childTree.setParent(this);
            childTree.setChildIndex(this.children.length-1);
        }
    },

    /** Add all elements of kids list as children of this node */
    addChildren: function(kids) {
        var i, t;
        for (i = 0; i < kids.length; i++) {
            t = kids[i];
            this.addChild(t);
        }
    },

    setChild: function(i, t) {
        if ( !t ) {
            return;
        }
        if ( t.isNil() ) {
            throw new Error("Can't set single child to a list");
        }
        if ( !this.children ) {
            this.children = this.createChildrenList();
        }
        this.children[i] = t;
        t.setParent(this);
        t.setChildIndex(i);
    },

    deleteChild: function(i) {
        if ( !this.children ) {
            return null;
        }
        if (i<0 || i>=this.children.length) {
            throw new Error("Index out of bounds.");
        }
        var killed = this.children.splice(i, 1)[0];
        // walk rest and decrement their child indexes
        this.freshenParentAndChildIndexes(i);
        return killed;
    },

    /** Delete children from start to stop and replace with t even if t is
     *  a list (nil-root tree).  num of children can increase or decrease.
     *  For huge child lists, inserting children can force walking rest of
     *  children to set their childindex; could be slow.
     */
    replaceChildren: function(startChildIndex, stopChildIndex, t) {
        if ( !this.children ) {
            throw new Error("indexes invalid; no children in list");
        }
        var replacingHowMany = stopChildIndex - startChildIndex + 1;
        var replacingWithHowMany;
        var newTree = t;
        var newChildren = null;
        // normalize to a list of children to add: newChildren
        if ( newTree.isNil() ) {
            newChildren = newTree.children;
        }
        else {
            newChildren = [];
            newChildren.push(newTree);
        }
        replacingWithHowMany = newChildren.length;
        var numNewChildren = newChildren.length;
        var delta = replacingHowMany - replacingWithHowMany;
        var j, i, child, indexToDelete, c, killed, numToInsert;
        // if same number of nodes, do direct replace
        if ( delta === 0 ) {
            j = 0; // index into new children
            for (i=startChildIndex; i<=stopChildIndex; i++) {
                child = newChildren[j];
                this.children[i] = child;
                child.setParent(this);
                child.setChildIndex(i);
                j++;
            }
        }
        else if ( delta > 0 ) { // fewer new nodes than there were
            // set children and then delete extra
            for (j=0; j<numNewChildren; j++) {
                this.children[startChildIndex+j] = newChildren[j];
            }
            indexToDelete = startChildIndex+numNewChildren;
            for (c=indexToDelete; c<=stopChildIndex; c++) {
                // delete same index, shifting everybody down each time
                killed = this.children.splice(indexToDelete, 1)[0];
            }
            this.freshenParentAndChildIndexes(startChildIndex);
        }
        else { // more new nodes than were there before
            // fill in as many children as we can (replacingHowMany) w/o moving data
            for (j=0; j<replacingHowMany; j++) {
                this.children[startChildIndex+j] = newChildren[j];
            }
            numToInsert = replacingWithHowMany-replacingHowMany;
            for (j=replacingHowMany; j<replacingWithHowMany; j++) {
                this.children.splice(startChildIndex+j, 0, newChildren[j]);
            }
            this.freshenParentAndChildIndexes(startChildIndex);
        }
    },

    /** Override in a subclass to change the impl of children list */
    createChildrenList: function() {
        return [];
    },

    isNil: function() {
        return false;
    },

    /** Set the parent and child index values for all child of t */
    freshenParentAndChildIndexes: function(offset) {
        if (!org.antlr.lang.isNumber(offset)) {
            offset = 0;
        }
        var n = this.getChildCount(),
            c,
            child;
        for (c = offset; c < n; c++) {
            child = this.getChild(c);
            child.setChildIndex(c);
            child.setParent(this);
        }
    },

    sanityCheckParentAndChildIndexes: function(parent, i) {
        if (arguments.length===0) {
            parent = null;
            i = -1;
        }

        if ( parent!==this.getParent() ) {
            throw new Error("parents don't match; expected "+parent+" found "+this.getParent());
        }
        if ( i!==this.getChildIndex() ) {
            throw new Error("child indexes don't match; expected "+i+" found "+this.getChildIndex());
        }
        var n = this.getChildCount(),
            c,
            child;
        for (c = 0; c < n; c++) {
            child = this.getChild(c);
            child.sanityCheckParentAndChildIndexes(this, c);
        }
    },

    /** BaseTree doesn't track child indexes. */
    getChildIndex: function() {
        return 0;
    },
    setChildIndex: function(index) {
    },

    /** BaseTree doesn't track parent pointers. */
    getParent: function() {
        return null;
    },
    setParent: function(t) {
    },

    getTree: function() {
        return this;
    },

    /** Print out a whole tree not just a node */
    toStringTree: function() {
        if ( !this.children || this.children.length===0 ) {
            return this.toString();
        }
        var buf = "",
            i,
            t;
        if ( !this.isNil() ) {
            buf += "(";
            buf += this.toString();
            buf += ' ';
        }
        for (i = 0; this.children && i < this.children.length; i++) {
            t = this.children[i];
            if ( i>0 ) {
                buf += ' ';
            }
            buf += t.toStringTree();
        }
        if ( !this.isNil() ) {
            buf += ")";
        }
        return buf;
    },

    getLine: function() {
        return 0;
    },

    getCharPositionInLine: function() {
        return 0;
    }
});

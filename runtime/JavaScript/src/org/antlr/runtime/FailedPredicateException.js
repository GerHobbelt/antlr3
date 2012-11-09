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

/** A semantic predicate failed during validation.  Validation of predicates
 *  occurs when normally parsing the alternative just like matching a token.
 *  Disambiguating predicate evaluation occurs when we hoist a predicate into
 *  a prediction decision.
 *
 *  @class
 *  @param {org.antlr.runtime.CommonTokenStream|org.antlr.runtime.tree.TreeNodeStream|org.antlr.runtime.ANTLRStringStream} input input stream that has an exception.
 *  @param {String} ruleName name of the rule in which the exception occurred.
 *  @param {String} predicateText the predicate that failed.
 *  @extends org.antlr.runtime.RecognitionException
 */
org.antlr.runtime.FailedPredicateException = function(input, ruleName, predicateText){
    org.antlr.runtime.FailedPredicateException.superclass.constructor.call(this, input);
    this.ruleName = ruleName;
    this.predicateText = predicateText;
};

org.antlr.lang.extend(
    org.antlr.runtime.FailedPredicateException,
    org.antlr.runtime.RecognitionException,
/** @lends org.antlr.runtime.FailedPredicateException.prototype */
{
    /** Create a string representation of this exception.
     *  @returns {String}
     */
    toString: function() {
        return "FailedPredicateException("+this.ruleName+",{"+this.predicateText+"}?)";
    },

    /** Name of this class.
     *  @type String
     */
    name: "org.antlr.runtime.FailedPredicateException"
});

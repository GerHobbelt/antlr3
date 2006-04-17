/*
 [The "BSD licence"]
 Copyright (c) 2005 Terence Parr
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
package org.antlr.runtime.debug;

import org.antlr.runtime.Token;
import org.antlr.runtime.RecognitionException;
import org.antlr.runtime.IntStream;
import org.antlr.runtime.TokenStream;

/** The default tracer mimics the traceParser behavior of ANTLR 2.x.
 *  This listens for debugging events from the parser and implies
 *  that you cannot debug and trace at the same time.
 */
public class Tracer implements DebugEventListener {
	public IntStream input;
	protected int level = 0;

	public Tracer(IntStream input) {
		this.input = input;
	}

	public void enterRule(String ruleName) {
		for (int i=1; i<=level; i++) {System.out.print(" ");}
		System.out.println("> "+ruleName+" lookahead(1)="+getInputSymbol(1));
		level++;
	}

	public void exitRule(String ruleName) {
		level--;
		for (int i=1; i<=level; i++) {System.out.print(" ");}
		System.out.println("< "+ruleName+" lookahead(1)="+getInputSymbol(1));
	}

	public void enterAlt(int alt) {}
	public void enterSubRule(int decisionNumber) {}
	public void exitSubRule(int decisionNumber) {}
	public void enterDecision(int decisionNumber) {}
	public void exitDecision(int decisionNumber) {}
	public void location(int line, int pos) {}
	public void consumeToken(Token token) {}
	public void consumeHiddenToken(Token token) {}
	public void LT(int i, Token t) {}
	public void mark(int i) {}
	public void rewind(int i) {}
	public void rewind() {}

	public void beginBacktrack(int level) {
	}

	public void endBacktrack(int level, boolean successful) {
	}

	public void recognitionException(RecognitionException e) {}
	public void beginResync() {}
	public void endResync() {}
	public void semanticPredicate(boolean result, String predicate) {}
	public void commence() {}
	public void terminate() {}

	public Object getInputSymbol(int k) {
		if ( input instanceof TokenStream ) {
			return ((TokenStream)input).LT(k);
		}
		return new Character((char)input.LA(k));
	}
}



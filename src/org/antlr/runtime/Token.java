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
package org.antlr.runtime;

public abstract class Token {
	public static final int EOR_TOKEN_TYPE = 1;

	/** imaginary tree navigation type; traverse "get child" link */
	public static final int DOWN = 2;
	/** imaginary tree navigation type; finish with a child list */
	public static final int UP = 3;

	public static final int MIN_TOKEN_TYPE = UP+1;

    public static final int EOF = CharStream.EOF;
	public static final Token EOF_TOKEN = new CommonToken(EOF);
	public static final int INVALID_TOKEN_TYPE = 0;
	public static final Token INVALID_TOKEN = new CommonToken(INVALID_TOKEN_TYPE);
	public static final int DEFAULT_CHANNEL = 0;

	/** Get the text of the token */
	public abstract String getText();

	/** Set the text, but it might be a nop such as for the CommonToken,
	 *  which doesn't have string pointers, just indexes into a char buffer.
	 */
	public void setText(String text) {
		throw new RuntimeException("you cannot set the text of "+
								   getClass().getName()+" token objects");
	}

	public abstract int getType();
	public abstract void setType(int ttype);
    public abstract int getLine();
    public abstract void setLine(int line);

	/** The index of the character relative to the beginning of the line 0..n-1 */
	public abstract int getCharPositionInLine();
	public abstract void setCharPositionInLine(int pos);

	public abstract int getChannel();
	public abstract void setChannel(int channel);

	/** An index from 0..n-1 of the token object in the input stream.
	 *  This must be valid in order to use the ANTLRWorks debugger.
	 */
	public abstract int getTokenIndex();
	public abstract void setTokenIndex(int index);
}

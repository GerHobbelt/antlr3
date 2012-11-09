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

/**
 * Loads the contents of a file all at once and passes its contents off to
 * {@link org.antlr.runtime.ANTLRStringStream}.
 * Currently this class can only be used in the Rhino JS interpreter.
 * @class
 * @extends org.antlr.runtime.ANTLRStringStream
 * @param {String} fileName path of the file to be loaded
 * @param {String} [encoding] name of the charset used for decoding
 */
org.antlr.runtime.ANTLRFileStream = function(fileName, encoding) {
    this.fileName = fileName;

    // @todo need to add support for other JS interpreters that have file i/o
    // hooks (SpiderMonkey and WSH come to mind).
    var method;
    if (org.antlr.env.ua.rhino) {
        method = "loadFileUsingJava";
    } else {
        throw new Error(
            "ANTLR File I/O is not supported in this JS implementation."
        );
    }

    var data = this[method](fileName, encoding);
    org.antlr.runtime.ANTLRFileStream.superclass.constructor.call(this, data);
};

org.antlr.lang.extend(org.antlr.runtime.ANTLRFileStream,
                  org.antlr.runtime.ANTLRStringStream,
/** @lends org.antlr.runtime.ANTLRFileStream.prototype */{
    /**
     * Get the file path from which the input was loaded.
     * @returns {String} the file path from which the input was loaded
     */
    getSourceName: function() {
        return this.fileName;
    },

    /**
     * Read the file and return its contents as a JS string.
     * @private
     * @param {String} fileName path of the file to be loaded
     * @param {String} [encoding] name of the charset used for decoding
     * @returns {String} the contents of the file
     */
    loadFileUsingJava: function(fileName, encoding) {
        // read the file using Java methods
        var f = new java.io.File(fileName),
            size = f.length(),
            isr,
            fis = new java.io.FileInputStream(f);
        if (encoding) {
            isr = new java.io.InputStreamReader(fis, encoding);
        } else {
            isr = new java.io.InputStreamReader(fis);
        }
        var data = java.lang.reflect.Array.newInstance(java.lang.Character.TYPE, size);
        isr.read(data, 0, size);

        // convert java char array to a javascript string
        return new String(new java.lang.String(data));
    }
});

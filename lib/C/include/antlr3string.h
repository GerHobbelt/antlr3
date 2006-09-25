/** \file
 * Simple string interface allows indiscriminate allocation of strings
 * such that they can be allocated all over the place and released in 
 * one chunk via a string factory - saves lots of hassle in remmebering what
 * strings were allocated where.
 */
#ifndef	_ANTLR3_STRING_H
#define	_ANTLR3_STRING_H

#include    <antlr3defs.h>
#include    <antlr3collections.h>

/** Base string class tracks the allocations and provides simple string
 *  tracking functions. Mostly you can work directly on the string for things
 *  that don't reallocate it, like strchr() etc. Perhaps someone will want to provide implementations for UTF8
 *  and so on.
 */
typedef	struct ANTLR3_STRING_struct
{

    /** The factor that created this string
     */
    pANTLR3_STRING_FACTORY	factory;

    /** Pointer to the current string value (starts at NULL unless
     *  the string allocator is told to create it with a preknown size.
     */
    pANTLR3_UINT8		chars;

    /** Current length of the string up to and not including, the trailing '\0'
     *  Note that the actual allocation (->size)
     *  is always at least one byte more than this to accomodate trailing '\0'
     */
    ANTLR3_UINT32		len;

    /** Current size of the string in bytes including the trailing '\0'
     */
    ANTLR3_UINT32		size;

    /** Index of string (allocation number) in case someone wants
     *  to explictly release it.
     */
    ANTLR3_UINT32		index;

    /** Pointer to function that sets the string value to a specific string in the default encoding
     *  for this string. For instance, if this is ASCII 8 bit, then this function is the same as set8
     *  but if the encoding is 16 bit, then the pointer is assumed to point to 16 bit characters not
     *  8 bit.
     */
    pANTLR3_UINT8   (*set)	(struct ANTLR3_STRING_struct * string, const char * chars);
   
    /** Pointer to function that sets the string value to a specific 8 bit string in the default encoding
     *  for this string. For instance, if this is a 16 bit string, then this function is the same as set8
     *  but if the encoding is 16 bit, then the pointer is assumed to point to 8 bit characters that must
     *  be converted to 16 bit characters on the fly.
     */
    pANTLR3_UINT8   (*set8)	(struct ANTLR3_STRING_struct * string, const char * chars);

    /** Pointer to function adds a raw char * type pointer in the default encoding
     *  for this string. For instance, if this is ASCII 8 bit, then this function is the same as append8
     *  but if the encoding is 16 bit, then the pointer is assumed to point to 16 bit characters not
     *  8 bit.
     */
    pANTLR3_UINT8   (*append)	(struct ANTLR3_STRING_struct * string, const char * newbit);

    /** Pointer to function adds a raw char * type pointer in the default encoding
     *  for this string. For instance, if this is a 16 bit string, then this function assumes the pointer
     *  points to 8 bit characters that must be converted on the fly.
     */
    pANTLR3_UINT8   (*append8)	(struct ANTLR3_STRING_struct * string, const char * newbit);

    /** Pointer to function that inserts the supplied string at the specified
     *  offset in the current string in the default encoding for this string. For instance, if this is an 8
     *  bit string, then this is the same as insert8, but if this is a 16 bit string, then the poitner
     *  must point to 16 bit characters.
     *  
     */
    pANTLR3_UINT8   (*insert)	(struct ANTLR3_STRING_struct * string, ANTLR3_UINT32 point, const char * newbit);

    /** Pointer to function that inserts the supplied string at the specified
     *  offset in the current string in the default encoding for this string. For instance, if this is a 16 bit string
     *  then the pointer is assumed to point at 8 bit characteres that must be converted on the fly.
     */
    pANTLR3_UINT8   (*insert8)	(struct ANTLR3_STRING_struct * string, ANTLR3_UINT32 point, const char * newbit);

    /** Pointer to function that sets the string value to a copy of the supplied string (strings must be in the 
     *  same encoding.
     */
    pANTLR3_UINT8   (*setS)	(struct ANTLR3_STRING_struct * string, struct ANTLR3_STRING_struct * chars);

    /** Pointer to function appends a copy of the characters contained in another string. Strings must be in the
     *  same encoding.
     */
    pANTLR3_UINT8   (*appendS)	(struct ANTLR3_STRING_struct * string, struct ANTLR3_STRING_struct * newbit);

    /** Pointer to function that inserts a copy of the characters in the supplied string at the specified
     *  offset in the current string. strings must be in the same encoding.
     */
    pANTLR3_UINT8   (*insertS)	(struct ANTLR3_STRING_struct * string, ANTLR3_UINT32 point, struct ANTLR3_STRING_struct * newbit);

    /** Pointer to function that inserts the supplied integer in string form at the specified
     *  offset in the current string.
     */
    pANTLR3_UINT8   (*inserti)	(struct ANTLR3_STRING_struct * string, ANTLR3_UINT32 point, ANTLR3_INT32 i);

    /** Pointer to function that adds a single character to the end of the string, in the encoding of the
     *  string - 8 bit, 16 bit, utf-8 etc. Input is a single UTF32 (32 bits wide integer) character.
     */
    pANTLR3_UINT8   (*addc)	(struct ANTLR3_STRING_struct * string, ANTLR3_UINT32 c);

    /** Pointer to function that adds the stringified representation of an integer
     *  to the string.
     */
    pANTLR3_UINT8   (*addi)	(struct ANTLR3_STRING_struct * string, ANTLR3_INT32 i);


}
    ANTLR3_STRING;

/** Definition of the string factory interface, which creates and tracks
 *  strings for you of various shapes and sizes.
 */
typedef struct	ANTLR3_STRING_FACTORY_struct
{
    /** List of all the strings that have been allocated by the factory
     */
    pANTLR3_LIST    strings;

    /* Index of next string that we allocate
     */
    ANTLR3_UINT32   index;

    /** Pointer to function that manufactures an empty string
     */
    pANTLR3_STRING  (*newRaw)	(struct ANTLR3_STRING_FACTORY_struct * factory);

    /** Pointer to function that manufactures a raw string with no text in it but space for size
     *  characters.
     */
    pANTLR3_STRING  (*newSize)	(struct ANTLR3_STRING_FACTORY_struct * factory, ANTLR3_UINT32 size);

    /** Pointer to function that manufactures a string from a given pointer and length. The pointer is assumed
     *  to point to characters in the same encodign as the string type, hence if this is a 16 bit string the
     *  pointer should point to 16 bit characters.
     */
    pANTLR3_STRING  (*newPtr)	(struct ANTLR3_STRING_FACTORY_struct * factory, pANTLR3_UINT8 string, ANTLR3_UINT32 size);

    /** Pointer to function that manufactures a string from a given pointer and length. The pointer is assumed to
     *  point at 8 bit charaters which must be converted on the fly to the encoding of the actual string.
     */
    pANTLR3_STRING  (*newPtr8)	(struct ANTLR3_STRING_FACTORY_struct * factory, pANTLR3_UINT8 string, ANTLR3_UINT32 size);

    /** Pointer to function that manufactures a string from a given pointer and length. The pointer is 
     *  assumed to point to characteres in the same encoding as the string itself, i.e. 16 bit if a 16 bit
     *  string and so on.
     */
    pANTLR3_STRING  (*newStr)	(struct ANTLR3_STRING_FACTORY_struct * factory, pANTLR3_UINT8 string);

    /** Pointer to function that manufactures a string from a given pointer and length. The pointer should
     *  point to 8 bit characters regardless of the actaul encoding of the string. The 8 bit characters
     *  will be converted to the actaul strign encoding on the fly.
     */
    pANTLR3_STRING  (*newStr8)	(struct ANTLR3_STRING_FACTORY_struct * factory, pANTLR3_UINT8 string);

    /** Pointer to function that deletes the string altogether
     */
    void	    (*destroy)	(struct ANTLR3_STRING_FACTORY_struct * factory, pANTLR3_STRING string);

    /** Pointer to function that returns a copy of the string in printable form without any control
     *  characters in it.
     */
    pANTLR3_STRING  (*printable)(struct ANTLR3_STRING_FACTORY_struct * factory, pANTLR3_STRING string);

    /** Pointer to function that closes the factory
     */
    void	    (*close)	(struct ANTLR3_STRING_FACTORY_struct * factory);

}
    ANTLR3_STRING_FACTORY;

#endif


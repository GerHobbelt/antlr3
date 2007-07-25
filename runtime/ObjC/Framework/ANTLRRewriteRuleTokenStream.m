//
//  ANTLRRewriteRuleTokenStream.m
//  ANTLR
//
//  Created by Kay Röpke on 7/16/07.
//  Copyright 2007 classDump. All rights reserved.
//

#import "ANTLRRewriteRuleTokenStream.h"


@implementation ANTLRRewriteRuleTokenStream


- (id) copyElement:(id)element
{
    return [treeAdaptor newTreeWithToken:element];
}

- (id) toTree:(id)element
{
    return [treeAdaptor newTreeWithToken:element];
}



@end
